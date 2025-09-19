import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';

export const GroupContext = React.createContext();

export const GroupProvider = ({ children }) => {
  const { db, currentUser } = useContext(AuthContext);

  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [allTags, setAllTags] = useState({});
  const [allLoot, setAllLoot] = useState([]);
  const [partyStorageContainers, setPartyStorageContainers] = useState([]);
  const [itemQuery, setItemQuery] = useState({ searchQuery: '', itemOwner: 'party' });
  const [itemOwners, setItemOwners] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [loadingContainers, setLoadingContainers] = useState(true);
  const [loadingLoot, setLoadingLoot] = useState(true);
  const [isGameMaster, setIsGameMaster] = useState(false);

  // Query declarations
  const groups = db.collection('groups');
  const groupDoc = groups.doc(currentGroup || ' ');
  const groupCurrency = groupDoc.collection('currency').doc('currency');
  const tagRef = groupDoc.collection('currency').doc('tags');

  useEffect(() => {
    console.log(itemQuery);
  }, [itemQuery]);

  // Fetch user's groups
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = groups
      .where('members', 'array-contains', currentUser.uid)
      .orderBy('groupName')
      .onSnapshot((snapshot) => {
        setGroupList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
    return () => unsubscribe();
  }, [currentUser]);

    // Fetch group data when group changes
  useEffect(() => {
    if (!currentGroup) return;

    // Tags
    const unsubscribeTags = tagRef.onSnapshot((doc) => setAllTags(doc.data()));

    // Loot
    const unsubscribeLoot = groupDoc
      .collection('loot')
      .orderBy('itemName')
      .onSnapshot((snapshot) => {
        setAllLoot(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoadingLoot(false);
      });

    // Item Owners
    const unsubscribeOwners = groupDoc
      .collection('itemOwners')
      .where('type', '==', 'party')
      .onSnapshot((snapshot) => {
        setItemOwners(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });

    // Group Data
    const unsubscribeGroupData = groupDoc.onSnapshot((doc) => {
      const data = doc.data();
      setGroupData(data);
      setItemQuery({ searchQuery: '', itemOwner: data?.favorites?.[currentUser.uid] || 'party' });
      setIsGameMaster(data?.gameMasters?.includes(currentUser?.uid) || false);
    });

    // Currency
    const unsubscribeCurrency = groupCurrency.onSnapshot((doc) => setCurrency(doc.data()));

    return () => {
      unsubscribeTags();
      unsubscribeLoot();
      unsubscribeOwners();
      unsubscribeGroupData();
      unsubscribeCurrency();
    };
    // eslint-disable-next-line
  }, [currentGroup]);

  // Containers effect - separate to react to GM status changes
  useEffect(() => {
    if (!currentGroup) return;

    const containerTypes = isGameMaster ? ['1', '2'] : ['1'];
    
    const unsubscribeContainers = groupDoc
      .collection('containers')
      .where('type', 'in', containerTypes)
      .orderBy('type', 'desc')
      .orderBy('name')
      .onSnapshot((snapshot) => {
        setPartyStorageContainers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoadingContainers(false);
      });

    return () => unsubscribeContainers();
    // eslint-disable-next-line
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

  const updateCurrency = (currencyKey, currencyQty) => {
    groupCurrency.set({ [itemQuery.itemOwner]: { [currencyKey]: Number(currencyQty) } }, { merge: true });
  };

  const updateUserCurrency = (currencyTotals) => {
    groupCurrency.set({ [itemQuery.itemOwner]: currencyTotals }, { merge: true });
  };

  const returnContainerItems = (containerId) => sortedLoot.filter((item) => item?.container === containerId);

  const containerExists = (containerList, item) => !!containerList.find((container) => container.id === item.container);

  const returnContainerlessItems = () => sortedLoot.filter((item) => !containerExists(partyStorageContainers, item));

  const getItemOwner = (itemOwnerId, setState) => {
    const owner = itemOwners.find((owner) => owner.id === itemOwnerId);
    setState(owner?.name || 'the party');
  };

  const setOneParam = (param) => setItemQuery((q) => ({ ...q, itemOwner: param }));

  const getItemOwners = (ownerRef) => {
    ownerRef
      .collection('itemOwners')
      .where('type', '==', 'party')
      .get()
      .then((snapshot) => {
        setItemOwners(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
  };

  return (
    <GroupContext.Provider
      value={{
        currentGroup,
        setCurrentGroup,
        setLoadingContainers,
        setLoadingLoot,
        groupData,
        itemOwners,
        checkOwnerExists,
        tagRef,
        groups,
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
        partyStorageContainers,
        getItemOwner,
        getItemOwners,
        isGameMaster,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
