import React, { createContext, useContext, useState, useEffect } from 'react';
// Importez app depuis firebase.config
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import firebase from '../firebase/firebase.config';
const {app} = firebase ;
const auth = getAuth(app);


const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                // Récupérer des informations supplémentaires sur l'utilisateur depuis la base de données ou ailleurs si nécessaire
                const user = {
                    id: userAuth.uid,
                    email: userAuth.email,
                    // Ajoutez d'autres détails d'utilisateur ici si nécessaire
                };
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password, role) => {
        try {
            const userAuth = await signInWithEmailAndPassword(auth, email, password);
            setUser({ id: userAuth.user.uid, email: userAuth.user.email, role: userAuth.user.role});
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
            setUser(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            throw error;
        }
    };

    const value = {
        user,
        login,
        logout,
    };

    if (loading) {
        return <p>Chargement...</p>; // Vous pouvez également afficher un spinner ou autre pendant le chargement
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
