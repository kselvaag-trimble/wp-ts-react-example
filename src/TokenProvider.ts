import * as oidc from 'oidc-client';
import { User } from './types';

interface Claims {
  iat: number,
  exp: number
}

// tslint:disable:max-classes-per-file
export class TokenProvider {

  private userManager: oidc.UserManager;
  private expires = 0;
  private userInfo?: User;
  private nextSessionCheck = Date.now();
  private onNewTokens?: (user: User) => void;

  constructor(settings: oidc.UserManagerSettings) {
    this.userManager = new oidc.UserManager(settings)

    oidc.Log.logger = console;
    oidc.Log.level = oidc.Log.WARN;
  }

  public async signIn(onNewTokens: (user: User) => void): Promise<void> {
    this.onNewTokens = onNewTokens;
    const validUser = await this.validateAuthenticatedUser();

    if (!validUser || this.getSecondsToRenew() < 120) {

      await this.signinRedirect();
      return;
    }

    await (this.userManager as oidc.OidcClient).clearStaleState(new oidc.WebStorageStateStore({ store: window.localStorage }));

    setInterval(this.monitorSession, 10000);
  }

  private async validateAuthenticatedUser() {
    const previouslyAuthenticatedUser = await this.userManager.getUser();
    let validUser = false;
    if (previouslyAuthenticatedUser) {
      const token = decodeIdToken(previouslyAuthenticatedUser.id_token);
      if (token) {
        if (this.getSecondsSinceIssued(token.iat) > 2) {
          try {
            const refreshedUser = await this.userManager.signinSilent();

            validUser = (refreshedUser && refreshedUser.profile);
            if (validUser) {
              await this.SignInUser(refreshedUser);
            }
          } catch (e) {
            console.error("Could not refresh user: " + e);
          }
        } else {
          validUser = true;
          await this.SignInUser(previouslyAuthenticatedUser);
        }
      }
    }
    return validUser;
  }

  private async SignInUser(user: oidc.User) {
    this.userInfo = convertOidcUser(user)
    const claims = decodeIdToken(user.id_token);

    this.expires = claims.exp;

    this.receivedNewTokens();

    const secondsToRenew = this.getSecondsToRenew();
    console.log(`Loaded user. New Expires ${this.expires}. Seconds until expire: ${secondsToRenew}. User: `, user);
  }

  private monitorSession = async () => {
    try {
      if (this.nextSessionCheck <= Date.now()) {
        const secondsToRenew = this.getSecondsToRenew();

        if (!this.userInfo || this.getSecondsToRenew() < 60) {
          await this.signinRedirect();
        } else if (this.getSecondsToRenew() < 200) {
          await this.signinSilent(secondsToRenew);
        }
      }
    } catch (e) {
      throw new Error("Monitor session failed: " + e);
    }
  }

  private async signinRedirect() {
    sessionStorage.setItem('requestedUrlAtSignIn', window.location.href);
    await this.userManager.signinRedirect();
  }

  private async signinSilent(secondsToRenew: number) {
    console.log(`Start silent renew. Seconds until expire: ${secondsToRenew}. Expires ${this.expires}`);

    this.nextSessionCheck = Date.now() + 20000;
    const oidcUser = await this.userManager.signinSilent();
    await this.SignInUser(oidcUser);
  }

  private receivedNewTokens() {
    if (this.onNewTokens && this.userInfo) {
      this.onNewTokens(this.userInfo);
    }
  }

  private getSecondsToRenew() {
    return Math.max(this.expires - (Date.now() / 1000) - 1, 0);
  }

  private getSecondsSinceIssued(issuedAt: number) {
    return Math.max((Date.now() / 1000) - issuedAt, 0);
  }

}

export class AuthenticationCallbackHandler {
  private userManager: oidc.UserManager;
  private inRenewIframe: boolean;
  private appRootUrl: string;
  private callbackUrl: string

  constructor(settings: oidc.UserManagerSettings, rootUrl: string) {
    this.userManager = new oidc.UserManager(settings);
    this.appRootUrl = rootUrl
    this.callbackUrl = settings.redirect_uri || "no callback url";

    this.inRenewIframe = window.frameElement && window.frameElement.nodeName === "IFRAME";

    oidc.Log.logger = console;
    oidc.Log.level = oidc.Log.WARN;
  }

  // Called in the page registered as callback url (in either main window or iframe)
  public async handleCallback(): Promise<void> {
    const url = window.location.href;

    if (this.isCallback()) {
      try {
        if (this.inRenewIframe) {
          await this.signinSilentCallback(url);
        } else {
          await this.signinRedirectCallback(url, this.appRootUrl);
        }
      } catch (e) {
        throw new Error("SignIn callback failed: " + e);
      }
    }
    else {
      throw new Error("The callback handler should only be used in the callback page");
    }
  }

  private async signinSilentCallback(url: string) {
    await this.userManager.signinSilentCallback(url);
  }

  private async signinRedirectCallback(url: string, rootUrl: string) {
    await this.userManager.signinRedirectCallback(url);
    const requestedUrl = sessionStorage.getItem('requestedUrlAtSignIn') || rootUrl;
    window.location.replace(requestedUrl);
  }

  private isCallback() {
    const url = window.location.href;
    return url.indexOf(this.callbackUrl) !== -1;
  }
}

function decodeIdToken(idToken?: string): Claims {
  if (idToken) {
    const [, payload,] = idToken.split('.');

    if (payload) {
      try {
        const parsed = JSON.parse(atob(payload));
        if (parsed && typeof parsed.iat !== 'undefined' && typeof parsed.exp !== 'undefined') {
          const claims: Claims = parsed;
          return claims;
        } else {
          throw new Error("Claims do not contain iat and exp");
        }
      } catch (e) {
        throw new Error("Error parsing id-token: " + e);
      }
    } else {
      throw new Error("Invalid id-token");
    }
  } else {
    throw new Error("No id-token to decode");
  }
}

function convertOidcUser(user: oidc.User): User {
  if (!user.profile) {
    throw new Error("Missing profile in oidc user");
  }
  return {
    firstName: user.profile['http://wso2.org/claims/firstname'],
    lastName: user.profile['http://wso2.org/claims/lastname'],
    idToken: user.id_token,
    accessToken: user.access_token
  };
}