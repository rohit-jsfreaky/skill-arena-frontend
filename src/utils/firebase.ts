import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize messaging with safety checks
let messagingInstance;

try {
  if ('Notification' in window) {
    messagingInstance = getMessaging(app);
    console.log("Firebase messaging initialized successfully");
  } else {
    console.log("Notifications not supported in this browser");
  }
} catch (error) {
  console.error("Error initializing Firebase messaging:", error);
}

export const messaging = messagingInstance;
export { getToken, onMessage };
