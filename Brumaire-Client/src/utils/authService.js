import FirebaseCredentials from '../constants/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';

const app = !firebase.apps.length
  ? firebase.initializeApp(FirebaseCredentials)
  : firebase.app();
export const auth = app.auth();
export default app;

// Sign Up with Email and Password
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up: ', error);
    return null;
  }
};

// Sign In with Email and Password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in: ', error);
    return null;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
    console.log('User signed out successfully.');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};
