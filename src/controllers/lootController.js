import { collection, doc, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

const COLLECTION_NAME = 'groups';
const LOOT_COLLECTION_NAME = 'loot';

export const createLootItem = async (lootData, groupId) => {
  const lootRef = collection(db, COLLECTION_NAME, groupId, LOOT_COLLECTION_NAME);
  return addDoc(lootRef, {
    ...lootData,
    created: serverTimestamp(),
    updated: serverTimestamp()
  }).catch((error) => {
    console.error('Error creating new item: ', error);
  });
};

export const updateLootItem = async (lootData, groupId, lootId) => {
  const lootRef = doc(db, COLLECTION_NAME, groupId, LOOT_COLLECTION_NAME, lootId);
  
  return setDoc(lootRef, {
    ...lootData,
    updated: serverTimestamp()
  }, { merge: true }).catch((error) => {
    console.error('Error updating item: ', error);
  });
};
