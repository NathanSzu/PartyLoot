import React, { useState, useEffect, useContext } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { AuthContext } from './AuthContext';

export const GroupContext = React.createContext();

export const GroupProvider = ({ children }) => {
  const { db } = useContext(AuthContext);

  // Default setting is ' ' so the app will initiate react-firebase-hooks useDocumentData call
  const [currentGroup, setCurrentGroup] = useState(' ');

  // Query declarations
  const groups = db.collection('groups');
  const groupDoc = groups.doc(currentGroup);

  const [groupData, loading] = useDocumentData(groupDoc);
  const [sortBy, setSortBy] = useState('party');

  // Resets sortBy when no group is selected
  useEffect(() => {
    if (currentGroup === ' ') {
      setSortBy('party');
    }
  }, [currentGroup]);

  return (
    <GroupContext.Provider value={{ currentGroup, setCurrentGroup, groupData, sortBy, setSortBy, groups, groupDoc }}>
      {!loading && children}
    </GroupContext.Provider>
  );
};
