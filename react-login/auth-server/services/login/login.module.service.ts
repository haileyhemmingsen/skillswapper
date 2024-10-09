// where actual functions are
import * as jwt from 'jsonwebtoken';
import { SignUpCredentials } from './login.module.index';
// import something for backend API

export class LoginService {
    public async signup(body: SignUpCredentials): Promise<boolean | undefined> {
      return true;
    }
}