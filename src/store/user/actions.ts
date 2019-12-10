import { User } from '../../types';
import { UserAction, SIGN_IN_USER } from './types';

export const signInUser = (user: User): UserAction => ({
  type: SIGN_IN_USER,
  user
});