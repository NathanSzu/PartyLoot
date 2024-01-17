import React, { useEffect, useState } from 'react';
import fb from '../firebase';
import firebase from 'firebase';
import metadata from '../../utils/metadata.json';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  // Default setting is ' ' so the app will initiate react-firebase-hooks useDocumentData call
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);

  const db = fb.firestore();
  const userRef = db.collection('users').doc(currentUser.uid);

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
  const securedRoutes = ['groups', 'history', 'loot', 'item-compendium', 'user-settings'];

  const setUsername = async (username) => {
    userRef
      .set(
        {
          displayName: username,
        },
        { merge: true }
      )
      .then(() => {})
      .catch((error) => {
        console.error('Error creating code: ', error);
      });
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

  const setGroupCode = () => {
    let code = generateGroupCode();

    db.collection('users')
      .where('code', '==', code)
      .get()
      .then((querySnapshot) => {
        let check = true;
        querySnapshot.forEach((doc) => {
          // if a document is found then the function restarts
          check = false;
        });
        if (check) {
          userRef
            .set(
              {
                code: code,
              },
              { merge: true }
            )
            .catch((error) => {
              console.error('Error assigning code: ', error);
            });
        }
        if (!check) setGroupCode();
      })
      .catch((error) => {
        console.error('Error checking for code match: ', error);
      });
  };

  const recordActivity = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        let visitCount = doc.data()?.visitCount;
        db.collection('users')
          .doc(currentUser.uid)
          .update({
            version: `${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision}`,
            latestActivity: firebase.firestore.FieldValue.serverTimestamp(),
            visitCount: visitCount ? firebase.firestore.FieldValue.increment(1) : 1,
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error('Error getting user:', err);
      });
  };

  const manageSession = (currentUser, pathname) => {
    if (currentUser) {
      bypassRoutes.forEach((route) => {
        if (pathname.includes(route)) {
          navigate('/groups')
        }
      })
    }
    if (!currentUser) {
      securedRoutes.forEach((route) => {
        if (pathname.includes(route)) {
          navigate('/')
        }
      })
    }
  };

  useEffect(() => {
    currentUser &&
      userRef
        .get()
        .then((doc) => {
          // Do nothing unless missing data
          if (!doc.data()?.displayName) setUsername(randomUsername());
          if (!doc.data()?.code) setGroupCode();
          recordActivity();
        })
        .catch((error) => {
          console.error('Error checking for existing code or username:', error);
        });
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = fb.auth().onAuthStateChanged(function (user) {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
      } else {
        setCurrentUser('');
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    manageSession(currentUser, location.pathname);
  }, [location])
  

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        randomName,
        userRef,
        db,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
