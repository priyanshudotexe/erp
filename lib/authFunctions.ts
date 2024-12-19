// lib/authFunctions.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase"; // Ensure this points to your Firebase configuration file

// Function to register a new user with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
    return userCredential.user; // Return user information
  } catch (error: any) {
    console.error("Error during sign-up:", error.message);
    throw error; // Optionally rethrow to handle in the UI
  }
};

// Function to log in an existing user with email and password
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    return userCredential.user; // Return user information
  } catch (error: any) {
    console.error("Error during login:", error.message);
    throw error; // Optionally rethrow to handle in the UI
  }
};

// Function to log out the current user
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out.");
  } catch (error: any) {
    console.error("Error during sign-out:", error.message);
    throw error; // Optionally rethrow to handle in the UI
  }
};
