import { UserAction, SIGN_IN_USER, UserState } from './types';

const userReducer = (state: UserState = null, action: UserAction): UserState => {
  switch (action.type) {
    case SIGN_IN_USER: return action.user;
    default: return state;
  }
}

export default userReducer;