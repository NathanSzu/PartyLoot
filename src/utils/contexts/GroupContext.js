import React, { useState, useEffect, useContext } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { AuthContext } from './AuthContext';
import { useLocation } from 'react-router-dom';

export const GroupContext = React.createContext();

export const GroupProvider = ({ children }) => {
  const { db, currentUser } = useContext(AuthContext);

  const location = useLocation();

  const clearGroupRoutes = ['groups', 'login', 'forgot-password', 'item-compendium', 'user-settings'];

  // Default setting is ' ' so the app will initiate react-firebase-hooks useDocumentData call
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupList, setGroupList] = useState([]);

  // Query declarations
  const groups = db.collection('groups');
  const groupDoc = groups.doc(currentGroup || ' ');
  const groupCurrency = groupDoc.collection('currency').doc('currency');

  const [groupData, loading] = useDocumentData(groupDoc);
  const [currency, loadingCurrency] = useDocumentData(groupCurrency);
  const [sortBy, setSortBy] = useState('party');

  const manageGroupSession = (pathname) => {
    clearGroupRoutes.forEach((route) => {
      if (pathname.includes(route)) {
        setCurrentGroup(null);
        setSortBy('party');
      }
    });
  };

  const updateCurrency = (currencyKey, currencyQty) => {
    groupCurrency.set(
      {
        [sortBy]: { [currencyKey]: Number(currencyQty) },
      },
      { merge: true }
    );
  };

  const updateUserCurrency = (currencyTotals) => {
    groupCurrency.set(
      {
        [sortBy]: currencyTotals,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    currentUser &&
      groups
        .where('members', 'array-contains', currentUser.uid)
        .orderBy('groupName')
        .onSnapshot((querySnapshot) => {
          let groupList = [];
          querySnapshot.forEach((doc) => {
            groupList.push({ id: doc.id, ...doc.data() });
          });

          setGroupList(groupList);
        });
  }, [currentUser]);

  useEffect(() => {
    manageGroupSession(location.pathname);
  }, [location]);

  return (
    <GroupContext.Provider
      value={{
        currentGroup,
        setCurrentGroup,
        groupData,
        sortBy,
        setSortBy,
        groups,
        groupDoc,
        groupList,
        currency,
        loadingCurrency,
        updateCurrency,
        updateUserCurrency,
      }}
    >
      {!loading && children}
    </GroupContext.Provider>
  );
};
