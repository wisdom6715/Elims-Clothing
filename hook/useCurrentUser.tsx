// hooks/useCurrentUser.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase.config";

type UserProfile = {
  uid:         string;
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  dialCode:    string;
  countryCode: string;
  displayName: string;
  photoURL:    string | null;
  provider:    string;
  createdAt:   any;
};

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }

      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const fallbackProfile: UserProfile = {
        uid: firebaseUser.uid,
        firstName: firebaseUser.displayName?.split(" ")[0] ?? "",
        lastName: firebaseUser.displayName?.split(" ").slice(1).join(" ") ?? "",
        email: firebaseUser.email ?? "",
        phone: firebaseUser.phoneNumber ?? "",
        dialCode: "",
        countryCode: "",
        displayName: firebaseUser.displayName ?? "",
        photoURL: firebaseUser.photoURL,
        provider: "",
        createdAt: null,
      };

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        unsubDoc = onSnapshot(
          userRef,
          (snap) => {
            if (snap.exists()) {
              setUser({ uid: firebaseUser.uid, ...snap.data() } as UserProfile);
            } else {
              setUser(fallbackProfile);
            }
            setLoading(false);
          },
          (err) => {
            console.warn("Could not sync user profile from Firestore:", err);
            setUser(fallbackProfile);
            setLoading(false);
          }
        );
      } catch (err) {
        console.warn("Failed to initialize user document listener:", err);
        setUser(fallbackProfile);
        setLoading(false);
      }
    });

    return () => {
      if (unsubDoc) unsubDoc();
      unsubAuth();
    };
  }, []);

  return { user, loading };
}