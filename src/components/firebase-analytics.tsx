"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { firebaseApp } from "@/lib/firebase";

export function FirebaseAnalytics() {
  useEffect(() => {
    isSupported().then((ok) => {
      if (ok) getAnalytics(firebaseApp);
    });
  }, []);

  return null;
}
