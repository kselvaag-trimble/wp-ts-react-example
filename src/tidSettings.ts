import * as oidc from 'oidc-client';

export const RootUrl = window.location.origin;

const callbackUrl = `${RootUrl}/tidauth.html`;
const clientId = "Ufrzdx_fxgrj0MRfJ3ksYtEUfZca";
const authority = "https://identity.trimble.com";

export const TidSettings: oidc.UserManagerSettings = {
  authority,
  client_id: clientId,
  redirect_uri: callbackUrl,
  response_type: "id_token token",
  scope: "openid",

  filterProtocolClaims: true,

  loadUserInfo: false,
  automaticSilentRenew: false,
  monitorSession: false,
  includeIdTokenInSilentRenew: false,
  silent_redirect_uri: callbackUrl,

  userStore: new oidc.WebStorageStateStore({
    prefix: "oidc",
    store: window.localStorage,
  })
};