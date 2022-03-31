import React, { useEffect, useState } from "react";
import firebaseApp from "../firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  // Default setting is ' ' so the app will initiate react-firebase-hooks useDocumentData call
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);

  const db = firebaseApp.firestore();
  const userRef = db.collection("users").doc(currentUser.uid);

  const randomAttr = [
    "Angry",
    "Frustrated",
    "Sad",
    "Excited",
    "Frightened",
    "Prideful",
    "Gloomy",
  ];

  const randomName = [
    "Wizard",
    "Fighter",
    "Warlock",
    "Artificer",
    "Rogue",
    "Sorcerer",
    "Monk",
    "Druid",
    "Bard",
    "Barbarian",
    "Cleric",
    "Paladin",
    "Ranger",
  ];

  const setUsername = (username) => {
    userRef
      .set(
        {
          displayName: username,
        },
        { merge: true }
      )
      .then(() => {})
      .catch((error) => {
        console.error("Error creating code: ", error);
      });
  };

  const randomUsername = () => {
    return `${randomAttr[Math.floor(Math.random() * randomAttr.length)]} ${
      randomName[Math.floor(Math.random() * randomName.length)]
    }`;
  };

  const setGroupCode = () => {
    const alphabet = "ABCDEFGHIJKLMNPQRSTUVWXYZ1234567890";
    let code = "";
    for (let i = 0; i < 3; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
      code += Math.floor(Math.random() * 10);
    }

    db.collection("users")
      .where("code", "==", code)
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
            .then(() => {})
            .catch((error) => {
              console.error("Error creating code: ", error);
            });
        }
        if (!check) setGroupCode();
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  useEffect(() => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.

        setCurrentUser(user);
        setLoading(false);
      } else {
        // No user is signed in.
        setCurrentUser("");
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        randomName,
        setUsername,
        setGroupCode,
        randomUsername,
        userRef,
        db,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
