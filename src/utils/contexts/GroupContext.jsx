import React, { useState, useEffect, useContext, useMemo } from 'react';
import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  getDocs, 
  setDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from './AuthContext';

export const GroupContext = React.createContext();

export const GroupProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [allTags, setAllTags] = useState({});
  const [allLoot, setAllLoot] = useState([]);
  const [allContainers, setAllContainers] = useState([]);
  const [itemQuery, setItemQuery] = useState({ searchQuery: '', itemOwner: 'party' });
  const [itemOwners, setItemOwners] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [loadingContainers, setLoadingContainers] = useState(false);
  const [loadingLoot, setLoadingLoot] = useState(true);
  const [isGameMaster, setIsGameMaster] = useState(false);

  // Document references
  const groupDoc = currentGroup ? doc(db, 'groups', currentGroup) : null;
  const groupCurrency = currentGroup ? doc(db, 'groups', currentGroup, 'currency', 'currency') : null;
  const tagRef = currentGroup ? doc(db, 'groups', currentGroup, 'currency', 'tags') : null;

  // Fetch user's groups
  useEffect(() => {
    if (!currentUser) return;
    
    const groupsRef = collection(db, 'groups');
    const q = query(
      groupsRef, 
      where('members', 'array-contains', currentUser.uid), 
      orderBy('groupName')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGroupList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  // Fetch group data when group changes
  useEffect(() => {
    if (!currentGroup || !groupDoc) return;

    // Tags
    const unsubscribeTags = onSnapshot(tagRef, (doc) => {
      if (doc.exists()) {
        setAllTags(doc.data());
      }
    });

    // Loot
    const lootRef = collection(db, 'groups', currentGroup, 'loot');
    const lootQuery = query(lootRef, orderBy('itemName'));
    const unsubscribeLoot = onSnapshot(lootQuery, (snapshot) => {
      setAllLoot(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoadingLoot(false);
    });

    // Item Owners
    const ownersRef = collection(db, 'groups', currentGroup, 'itemOwners');
    const ownersQuery = query(ownersRef, where('type', '==', 'party'));
    const unsubscribeOwners = onSnapshot(ownersQuery, (snapshot) => {
      setItemOwners(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Group Data
    const unsubscribeGroupData = onSnapshot(groupDoc, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setGroupData(data);
        setItemQuery({ searchQuery: '', itemOwner: data?.favorites?.[currentUser?.uid] || 'party' });
        setIsGameMaster(data?.gameMasters?.includes(currentUser?.uid) || false);
      }
    });

    // Currency
    const unsubscribeCurrency = onSnapshot(groupCurrency, (doc) => {
      if (doc.exists()) {
        setCurrency(doc.data());
      }
    });

    return () => {
      unsubscribeTags();
      unsubscribeLoot();
      unsubscribeOwners();
      unsubscribeGroupData();
      unsubscribeCurrency();
    };
  }, [currentGroup, currentUser]);

  // Containers effect - separate to react to GM status changes
  useEffect(() => {
    if (!currentGroup) {
      setLoadingContainers(false);
      return;
    }

    setLoadingContainers(true);

    const containersRef = collection(db, 'groups', currentGroup, 'containers');
    const containersQuery = query(
      containersRef,
      orderBy('type', 'desc'),
      orderBy('name')
    );
    
    const unsubscribeContainers = onSnapshot(containersQuery, (snapshot) => {
      const containers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllContainers(containers);
      setLoadingContainers(false);
    });

    return () => unsubscribeContainers();
  }, [currentGroup, isGameMaster]);

  // Derived: sortedLoot and filteredLoot
  const sortedLoot = useMemo(() => {
    let ownerFiltered =
      itemQuery.itemOwner === 'party' ? allLoot : allLoot.filter((item) => item.ownerId === itemQuery.itemOwner);

    if (itemQuery.searchQuery) {
      const regex = new RegExp(itemQuery.searchQuery, 'i');
      return ownerFiltered.filter(
        (item) => regex.test(item.itemDesc || '') || regex.test(item.itemName || '') || regex.test(item.itemTags || '')
      );
    }
    return ownerFiltered;
  }, [itemQuery, allLoot]);

  // Utility functions
  const checkOwnerExists = (id) => itemOwners.some((owner) => owner.id === id);

  const updateCurrency = async (currencyKey, currencyQty) => {
    if (!groupCurrency) return;
    try {
      await setDoc(groupCurrency, { 
        [itemQuery.itemOwner]: { [currencyKey]: Number(currencyQty) } 
      }, { merge: true });
    } catch (error) {
      console.error('Error updating currency:', error);
    }
  };

  const updateUserCurrency = async (currencyTotals) => {
    if (!groupCurrency) return;
    try {
      await setDoc(groupCurrency, { 
        [itemQuery.itemOwner]: currencyTotals 
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user currency:', error);
    }
  };

  const returnContainerItems = (containerId) => sortedLoot.filter((item) => item?.container === containerId);

  const returnContainerlessItems = () => sortedLoot.filter((item) => {
    if (!item.container) return true;

      return false;
  });

  const getItemOwner = (itemOwnerId, setState) => {
    const owner = itemOwners.find((owner) => owner.id === itemOwnerId);
    setState(owner?.name || 'the party');
  };

  const setOneParam = (param) => setItemQuery((q) => ({ ...q, itemOwner: param }));

  const getItemOwners = async (group) => {
    if (!group) return;
    try {
      const ownersRef = collection(db, 'groups', group, 'itemOwners');
      const q = query(ownersRef, where('type', '==', 'party'));
      const snapshot = await getDocs(q);
      setItemOwners(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error getting item owners:', error);
    }
  };

  return (
    <GroupContext.Provider
      value={{
        currentGroup,
        setCurrentGroup,
        setLoadingContainers,
        setLoadingLoot,
        allContainers,
        groupData,
        itemOwners,
        checkOwnerExists,
        tagRef,
        groupDoc,
        groupList,
        allTags,
        currency,
        updateCurrency,
        updateUserCurrency,
        sortedLoot,
        setItemQuery,
        itemQuery,
        loadingContainers,
        loadingLoot,
        setOneParam,
        returnContainerItems,
        returnContainerlessItems,
        getItemOwner,
        getItemOwners,
        isGameMaster,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
