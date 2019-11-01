import {AuthenticationCallbackHandler} from './TokenProvider';
import { TidSettings, RootUrl } from './tidSettings';

const callbackHandler = new AuthenticationCallbackHandler(TidSettings, RootUrl);
callbackHandler.handleCallback();
