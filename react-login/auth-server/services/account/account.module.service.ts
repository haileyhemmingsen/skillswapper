// where actual functions are
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SignUpCredentials, UpdateEmail, UpdatePassword, UpdateUsername, Authenticated } from './account.module.index';
// import something for backend API

export class LoginService {
  private saltRounds = 10;
  public async signup(body: SignUpCredentials): Promise<boolean | undefined> {
    try {
      // Check if the user already exists in Firestore (optional, as Firebase Auth handles this)
      const userRef = doc(db, 'users', body.email);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        // If user exists, return undefined
        return undefined;
      }

      const uuid = uuidv4();
      const hashedPassword = await bcrypt.hash(body.password, this.saltRounds);

      // Insert user credentials into Firestore
      await setDoc(doc(db, 'users', body.email), {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        // zip: body.zip,
        password: hashedPassword,
        createdAt: new Date(),
        uuid: uuid,
      });

      return true;
    } catch (error) {
      console.error('Error signing up: ', error);
      return undefined;
    }
  }
    public async login(credentials: SignUpCredentials): Promise<Authenticated|undefined> {
      // search database for credentials, match email, match hashed passwords then return true, else return false
      try {
        const userRef = doc(db, 'users', credentials.email);
        const userSnapshot = await getDoc(userRef);
        
        if (!userSnapshot.exists()) {
          // User not found, login fails
          return undefined;
        }
        const userData = userSnapshot.data();
        const passwordMatch = await bcrypt.compare(credentials.password, userData.password);

        if (passwordMatch) {
          const accessToken = jwt.sign(
            {id: userData.id, email: credentials.email, password: credentials.password}, 
            `${process.env.MASTER_SECRET}`, {
              expiresIn: '30m',
              algorithm: 'HS256'
            });
            return {id: userData.id, accessToken: accessToken};
        } else {
          return undefined;
        }
      } catch (error) {
        console.error('Error Logging In: ', error);
        return undefined;
      }
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