import { User } from '../../types';

export type UserState = User | null;

export const SIGN_IN_USER = 'SIGN_IN_USER';

interface SignInUserAction {
  type: typeof SIGN_IN_USER
  user: User
}

export type UserAction = SignInUserAction;
