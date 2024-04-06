// AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import app from '../firebase/firebase.config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchUserRole(user.uid);  // Appel de la fonction pour récupérer le rôle
      } else {
        setUser(null);
        setUserRole(null);  // Réinitialisez le rôle lorsque l'utilisateur se déconnecte
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userAuth = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = doc(db, "users", userAuth.user.uid);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        setUser({ 
          id: userAuth.user.uid, 
          email: userAuth.user.email, 
          role: userSnap.data().role 
        });
        setUserRole(userSnap.data().role);  // Définir également le rôle
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  };
  
  const fetchUserRole = async (uid) => {
    const userDoc = doc(db, "users", uid);
    const userSnap = await getDoc(userDoc);
    
    if (userSnap.exists()) {
      setUserRole(userSnap.data().role);
    } else {
      console.log("No such document!");
    }
  };

  const logout = () => {
    // Ajoutez ici la logique pour la déconnexion
  };

  const value = {
    user,
    userRole,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
