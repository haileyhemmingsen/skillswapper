// where actual functions are
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Response as ExpressResponse } from 'express';
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
        zip: body.zip,
        password: hashedPassword,
        createdAt: new Date(),
        uuid: uuid,
      });

      return true;
    } catch (error) {
      console.error('Error Signing Up: ', error);
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
      // console.log('uuid: ' + userData.id);
      const passwordMatch = await bcrypt.compare(credentials.password, userData.password);

      // password should not be in the sessionToken
      // it was before, now it is changed
      if (passwordMatch) {
        const accessToken = jwt.sign(
          {id: userData.uuid, email: credentials.email, name: userData.firstname}, 
          `${process.env.JWT_SECRET}`, {
            expiresIn: '30m',
            algorithm: 'HS256'
          });


          
          return {id: userData.uuid, accessToken: accessToken};
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
    // compare password in db to old password passed through, then update password to new password otherwise return unauthorized
    try {
      const userRef = doc(db, 'users', body.email);
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        // User not found, login fails
        console.log('User not found');
        return undefined;
      } 
      const userData = userSnapshot.data();
      const passwordMatch = await bcrypt.compare(body.oldPass, userData.password);
      if (passwordMatch) {
        const hashedPassword = await bcrypt.hash(body.newPass, this.saltRounds);
        await updateDoc(userRef, { password: hashedPassword });
        return true;
      } 
      console.log('Password does not match');
      return undefined;
    } catch(error) {
      console.error('Error Changing Password: ', error);
      return undefined;
    }
  }
  public async changeEmail(body: UpdateEmail): Promise<boolean | undefined> {
    try {
      // Get the reference to the old document using the old email as the ID
      const userRef = doc(db, 'users', body.oldEmail);
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        console.log('User not found');
        return undefined;
      }
      // Get the user data from the existing document
      const userData = userSnapshot.data();
      // Create a new document with the new email as the document ID
      const newUserRef = doc(db, 'users', body.newEmail);
      await setDoc(newUserRef, {
        ...userData,
        email: body.newEmail, // Update the email field in the new document
      });
      // Delete the old document
      await deleteDoc(userRef);
      return true;
    } catch (error) {
      console.error('Error Changing Email: ', error);
      return undefined;
    }
  }
  public async changeUsername(body: UpdateUsername): Promise<boolean|undefined> {
      return true;
  }
}