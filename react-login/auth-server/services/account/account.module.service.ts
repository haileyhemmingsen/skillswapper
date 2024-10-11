// where actual functions are
import * as jwt from 'jsonwebtoken';
import { SignUpCredentials, UpdateEmail, UpdatePassword, UpdateUsername } from './account.module.index';
// import something for backend API

export class LoginService {
    public async signup(body: SignUpCredentials): Promise<boolean | undefined> {
      return true;
    }
    public async login(body: SignUpCredentials): Promise<boolean|undefined> {
        // search database for credentials, match email, match hashed passwords then return true, else return false
        return true;
    }
    public async changePassword(body: UpdatePassword): Promise<boolean|undefined> {
        // attempt to change password, if database returns success return true here, else if error then return false
        return true;
    }
    public async changeEmail(body: UpdateEmail): Promise<boolean|undefined> {
        // attempt to change email, if database success return true else return false
        return true;
    }
    public async changeUsername(body: UpdateUsername): Promise<boolean|undefined> {
        return true;
    }
}