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
  const [sortedLoot, setSortedLoot] = useState({
    sorted: [],
  });
  const [itemQuery, setItemQuery] = useState({
    searchQuery: '',
    itemOwner: 'party',
  });
  const [itemOwners, setItemOwners] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(false);

  // Query declarations
  const groups = db.collection('groups');
  const groupDoc = groups.doc(currentGroup || ' ');
  const groupCurrency = groupDoc.collection('currency').doc('currency');
  const tagRef = groupDoc.collection('currency').doc('tags');

  const manageGroupSession = (pathname) => {
    clearGroupRoutes.forEach((route) => {
      if (pathname.includes(route)) {
        setCurrentGroup(null);
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
        let tempAllLoot = [];
        querySnapshot.forEach((doc) => {
          tempAllLoot.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setAllLoot(tempAllLoot);
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
    setSortedLoot({
      ...sortedLoot,
      sorted: queryFiltered,
    });
  };

  const returnContainerItems = (itemArray, containerId) => {
    let containerItems = itemArray.filter((item) => item?.container === containerId)
    return containerItems
  }

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
        setItemQuery,
        itemQuery,
        setOneParam,
        getItemOwners,
        getItemOwner,
      }}
    >
      {!loading && children}
    </GroupContext.Provider>
  );
};
