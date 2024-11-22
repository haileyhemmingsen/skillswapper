import * as jwt from "jsonwebtoken";

import {SessionUser} from '../types/express';
import {User} from '.';

// Global AuthService that can be called in Routes using the 
// @Security decorator within the Route
export class AuthService {
  public async check(cookieAuthHeader?: string, scopes?: string[]): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      if (!cookieAuthHeader) {
        // console.log("No Cookie Provided");
        reject(new Error("Unauthorized"));
      }
      else {
        const cookies = cookieAuthHeader.split('; ');
        let token = undefined;
        for (let i = 0; i < cookies.length; i += 1) { // for cookie in cookies
            const [name, value] = cookies[i].split('=');
            if (name === 'accessToken') { // find the accessToken cookie
                token = value; // grab its value
            }
        }
        if (token === undefined) {
          // console.log("No Token Provided");
            reject(new Error("No Token Provided"));
            return;
        }
        // const token = cookieAuthHeader.split(' ')[1];
        jwt.verify(token,
          `${process.env.JWT_SECRET}`,
            (error: jwt.VerifyErrors | null, decoded?: object| string) => {
            const user = decoded as User;
            if (error) {
                reject(error);
            }
            resolve({email:user.email, name: user.name, id: user.id});
          });
        }
    });
 }
}
