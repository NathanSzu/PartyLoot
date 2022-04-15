import React, { useState, useEffect, useContext } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { AuthContext } from './AuthContext';

export const GroupContext = React.createContext();

export const GroupProvider = ({ children }) => {
  const { db } = useContext(AuthContext);

  // Default setting is ' ' so the app will initiate react-firebase-hooks useDocumentData call
  const [currentGroup, setCurrentGroup] = useState(' ');
  const [groupData, loading] = useDocumentData(db.collection('groups').doc(currentGroup));

  // Used in GoldTracker, ItemSearch, and OwnerFilter
  const [sortBy, setSortBy] = useState('All');

  // Resets sortBy when no group is selected
  useEffect(() => {
    if (currentGroup === ' ') {
      setSortBy('All');
    }
  }, [currentGroup]);

  return (
    <GroupContext.Provider value={{ currentGroup, setCurrentGroup, groupData, sortBy, setSortBy }}>
      {!loading && children}
    </GroupContext.Provider>
  );
};
