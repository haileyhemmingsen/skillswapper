// where actual functions are
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { auth, db } from '../../firebase'; // Firebase imports
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SignUpCredentials, UpdateEmail, UpdatePassword, UpdateUsername } from './account.module.index';
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

      // has two different ways to do it
      // could use the built in method from firebase
      // or we can do it this way with bcrypt
      // Create the user in Firebase Authentication
      const hashedPassword = await bcrypt.hash(body.password, this.saltRounds);

      // Insert user credentials into Firestore
      await setDoc(doc(db, 'users', body.email), {
        email: body.email,
        password: hashedPassword,
        createdAt: new Date(),
        // uid: userCredential.user.uid,
      });

      return true;
    } catch (error) {
      console.error('Error signing up: ', error);
      return undefined;
    }
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