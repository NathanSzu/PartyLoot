import React, { useState, useEffect, useContext } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { AuthContext } from './AuthContext';

export const GroupContext = React.createContext();

// const query = groups.where('members', 'array-contains', `${currentUser.uid}`);
// const [groupList, loading] = useCollectionData(query, { idField: 'id' });

export const GroupProvider = ({ children }) => {
  const { db, currentUser } = useContext(AuthContext);

  // Default setting is ' ' so the app will initiate react-firebase-hooks useDocumentData call
  const [currentGroup, setCurrentGroup] = useState(' ');
  const [groupList, setGroupList] = useState([]);

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

  return (
    <GroupContext.Provider
      value={{ currentGroup, setCurrentGroup, groupData, sortBy, setSortBy, groups, groupDoc, groupList }}
    >
      {!loading && children}
    </GroupContext.Provider>
  );
};
