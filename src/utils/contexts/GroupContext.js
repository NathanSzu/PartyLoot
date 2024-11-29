import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useLocation } from 'react-router-dom';

export const GroupContext = React.createContext();

export const GroupProvider = ({ children }) => {
  const { db, currentUser } = useContext(AuthContext);

  const location = useLocation();

  const clearGroupRoutes = ['groups', 'login', 'forgot-password', 'item-compendium', 'user-settings'];

  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [allTags, setAllTags] = useState({});
  const [allLoot, setAllLoot] = useState([]);
  const [partyStorageContainers, setPartyStorageContainers] = useState([]);
  const [sortedLoot, setSortedLoot] = useState([]);
  const [filteredLoot, setFilteredLoot] = useState([]);
  const [itemQuery, setItemQuery] = useState({
    searchQuery: '',
    itemOwner: 'party',
  });
  const [itemOwners, setItemOwners] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [loadingContainers, setLoadingContainers] = useState(true);
  const [loadingLoot, setLoadingLoot] = useState(true);

  // Query declarations
  const groups = db.collection('groups');
  const groupDoc = groups.doc(currentGroup || ' ');
  const groupCurrency = groupDoc.collection('currency').doc('currency');
  const tagRef = groupDoc.collection('currency').doc('tags');

  const manageGroupSession = (pathname) => {
    clearGroupRoutes.forEach((route) => {
      if (pathname.includes(route)) {
        setCurrentGroup(null);
        setLoadingContainers(true);
        setLoadingLoot(true);
        setAllLoot([]);
        setPartyStorageContainers([]);
        setItemQuery({ ...itemQuery, itemOwner: 'party' });
      }
    });
  };

  const getCurrency = () => {
    groupCurrency.onSnapshot((doc) => {
      setCurrency(doc.data());
    });
  };

  const updateCurrency = (currencyKey, currencyQty) => {
    groupCurrency.set(
      {
        [itemQuery.itemOwner]: { [currencyKey]: Number(currencyQty) },
      },
      { merge: true }
    );
  };

  const updateUserCurrency = (currencyTotals) => {
    groupCurrency.set(
      {
        [itemQuery.itemOwner]: currencyTotals,
      },
      { merge: true }
    );
  };

  const getLootItems = () => {
    groupDoc
      .collection('loot')
      .orderBy('itemName')
      .onSnapshot((querySnapshot) => {
        let items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setAllLoot(items);
        setLoadingLoot(false);
      });
  };

  const getLootContainers = (containerType) => {
    groupDoc
      .collection('containers')
      .where('type', '==', containerType)
      .orderBy('name')
      .onSnapshot((querySnapshot) => {
        let containers = [];
        querySnapshot.forEach((doc) => {
          containers.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPartyStorageContainers(containers);
        setLoadingContainers(false);
      });
  };

  const sortLootItems = () => {
    let ownerFiltered = [];
    let queryFiltered = [];
    if (itemQuery.itemOwner === 'party') {
      ownerFiltered = allLoot;
    } else {
      ownerFiltered = allLoot.filter((item) => item.ownerId === itemQuery.itemOwner);
    }

    if (itemQuery.searchQuery) {
      queryFiltered = ownerFiltered.filter(
        (item) =>
          item.itemDesc?.search(new RegExp(`${itemQuery.searchQuery}`, 'i')) >= 0 ||
          item.itemName?.search(new RegExp(`${itemQuery.searchQuery}`, 'i')) >= 0 ||
          item.itemTags?.search(new RegExp(`${itemQuery.searchQuery}`, 'i')) >= 0
      );
    } else {
      queryFiltered = ownerFiltered;
    }
    setSortedLoot(queryFiltered);
    setFilteredLoot(ownerFiltered);
  };

  const returnContainerItems = (containerId) => {
    let containerItems = sortedLoot?.filter((item) => item?.container === containerId);
    return containerItems;
  };

  const containerExists = (containerList, item) => {
    let exists = false;
    if (item?.container) {
      containerList.forEach((container) => {
        if (container.id === item.container) exists = true;
      });
    }
    return exists;
  };

  const returnContainerlessItems = () => {
    let containerlessItems = sortedLoot?.filter((item) => !containerExists(partyStorageContainers, item));
    return containerlessItems;
  };

  const getItemOwners = (dbRef = groupDoc) => {
    dbRef
      .collection('itemOwners')
      .where('type', '==', 'party')
      .onSnapshot((querySnapshot) => {
        let tempOwners = [];
        querySnapshot.forEach((doc) => {
          tempOwners.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setItemOwners(tempOwners);
      });
  };

  const getItemOwner = (itemOwnerId, setState) => {
    const filteredOwner = itemOwners.filter((owner) => owner.id === itemOwnerId);
    filteredOwner?.[0] ? setState(filteredOwner[0].name) : setState('the party');
  };

  const getGroupData = () => {
    groupDoc.onSnapshot((doc) => {
      setGroupData(doc.data());
    });
  };

  const setOneParam = (param) => {
    setItemQuery({
      ...itemQuery,
      itemOwner: param,
    });
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

  // When a group is selected, set the tags, get the related loot items, and reset the searchQuery state
  useEffect(() => {
    if (currentGroup) {
      tagRef.onSnapshot((querySnapshot) => {
        setAllTags(querySnapshot.data());
      });
      setItemQuery({
        searchQuery: '',
        itemOwner: 'party',
      });
      getLootItems();
      getLootContainers('1');
      getItemOwners();
      getGroupData();
      getCurrency();
    }
  }, [currentGroup]);

  useEffect(() => {
    sortLootItems();
  }, [itemQuery, allLoot]);

  useEffect(() => {
    manageGroupSession(location.pathname);
  }, [location]);

  return (
    <GroupContext.Provider
      value={{
        currentGroup,
        setCurrentGroup,
        groupData,
        itemOwners,
        tagRef,
        groups,
        groupDoc,
        groupList,
        allTags,
        currency,
        updateCurrency,
        updateUserCurrency,
        sortedLoot,
        filteredLoot,
        setItemQuery,
        itemQuery,
        loadingContainers,
        loadingLoot,
        setOneParam,
        returnContainerItems,
        returnContainerlessItems,
        partyStorageContainers,
        getItemOwners,
        getItemOwner,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
