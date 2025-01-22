import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator, signInAnonymously } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Initialize Firestore
let db;
try {
  db = getFirestore(app);

  // Enable offline persistence
  if (process.env.NODE_ENV === "development") {
    // Log the full config in development for debugging
    console.log("Full Firebase Config:", {
      ...firebaseConfig,
      apiKey: "HIDDEN",
    });

    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === "failed-precondition") {
        console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
      } else if (err.code === "unimplemented") {
        console.warn("The current browser doesn't support persistence.");
      }
    });
  }
} catch (error) {
  console.error("Error initializing Firestore:", error);
  throw error;
}

// Initialize Auth with anonymous sign-in
let auth;
try {
  auth = getAuth(app);
  // Sign in anonymously for development
  if (process.env.NODE_ENV === "development") {
    signInAnonymously(auth).catch((error) => {
      if (error.code === "auth/configuration-not-found") {
        console.warn("Anonymous authentication is not enabled in Firebase console. Please enable it in Firebase Console > Authentication > Sign-in methods");
      } else {
        console.error("Error signing in anonymously:", error);
      }
    });
  }
} catch (error) {
  console.error("Error initializing Auth:", error);
  throw error;
}

// Initialize Analytics only in production
let analytics = null;
if (process.env.NODE_ENV === "production") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Error initializing Analytics:", error);
  }
}

// Log initialization success
console.log("Firebase initialized successfully with project:", firebaseConfig.projectId);

export { db, auth, analytics };
export default app;
