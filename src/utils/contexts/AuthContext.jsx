import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import metadata from '../metadata.json';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const randomAttr = ['Angry', 'Frustrated', 'Sad', 'Excited', 'Frightened', 'Prideful', 'Gloomy'];

  const randomName = [
    'Wizard',
    'Fighter',
    'Warlock',
    'Artificer',
    'Rogue',
    'Sorcerer',
    'Monk',
    'Druid',
    'Bard',
    'Barbarian',
    'Cleric',
    'Paladin',
    'Ranger',
  ];

  const bypassRoutes = ['login', 'forgot-password'];
  const securedRoutes = ['groups', 'history', 'loot', 'compendium', 'settings'];

  const setUsername = async (username) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        displayName: username,
      }, { merge: true });
    } catch (error) {
      console.error('Error creating username: ', error);
    }
  };

  const randomUsername = () => {
    return `${randomAttr[Math.floor(Math.random() * randomAttr.length)]} ${
      randomName[Math.floor(Math.random() * randomName.length)]
    }`;
  };

  const generateGroupCode = () => {
    const alphabet = 'ABCDEFGHIJKLMNPQRSTUVWXYZ1234567890';
    let code = '';
    for (let i = 0; i < 3; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
      code += Math.floor(Math.random() * 10);
    }
    return code;
  };

  const setGroupCode = async () => {
    let code = generateGroupCode();

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('code', '==', code));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          code: code,
        }, { merge: true });
      } else {
        // Recursively try again if code exists
        await setGroupCode();
      }
    } catch (error) {
      console.error('Error checking for code match: ', error);
    }
  };

  const recordActivity = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        let visitCount = userDoc.data()?.visitCount;
        await updateDoc(userRef, {
          version: `${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision}`,
          latestActivity: serverTimestamp(),
          visitCount: visitCount ? increment(1) : 1,
        });
      }
    } catch (err) {
      console.error('Error recording activity:', err);
    }
  };

  const checkOrSetData = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (!data?.displayName) await setUsername(randomUsername());
        if (!data?.code) await setGroupCode();
        await recordActivity();
      } else {
        // Create new user document
        await setUsername(randomUsername());
        await setGroupCode();
        await recordActivity();
      }
    } catch (error) {
      console.error('Error checking for existing code or username:', error);
    }
  };

  const getUserData = () => {
    if (currentUser?.uid) {
      const userRef = doc(db, 'users', currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
        }
      }, (error) => {
        console.error('Error getting user data:', error);
      });
      
      return unsubscribe;
    }
  };

  const manageSession = (currentUser, pathname) => {
    if (currentUser) {
      bypassRoutes.forEach((route) => {
        if (pathname.includes(route)) {
          navigate('/groups');
        }
      });
    }
    if (!currentUser) {
      securedRoutes.forEach((route) => {
        if (pathname.includes(route)) {
          navigate('/');
        }
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      checkOrSetData();
      const unsubscribe = getUserData();
      
      // Cleanup function
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
      } else {
        setCurrentUser('');
        setUserData(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    manageSession(currentUser, location.pathname);
  }, [location, currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        randomName,
        setUsername,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
