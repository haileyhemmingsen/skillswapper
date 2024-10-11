import * as jwt from "jsonwebtoken";

import {SessionUser} from '../types/express';
import {User} from '.';

// Global AuthService that can be called in Routes using the 
// @Security decorator within the Route
export class AuthService {
  public async check(authHeader?: string, scopes?: string[]): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error("Unauthorized"));
      }
      else {
        const token = authHeader.split(' ')[1];
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
