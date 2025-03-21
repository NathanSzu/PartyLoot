import firebase from 'firebase/app';
import 'firebase/firestore';

const COLLECTION_NAME = 'groups';
const LOOT_COLLECTION_NAME = 'loot';

export const createLootItem = async (lootData, groupId) => {
  const db = firebase.firestore();
  const lootRef = db.collection(COLLECTION_NAME).doc(groupId).collection(LOOT_COLLECTION_NAME);
  return lootRef.add({
    ...lootData,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    updated: firebase.firestore.FieldValue.serverTimestamp()
  }).catch((error) => {
    console.error('Error creating new item: ', error);
  });
};

export const updateLootItem = async (lootData, groupId, lootId) => {
  const db = firebase.firestore();
  const lootRef = db.collection(COLLECTION_NAME).doc(groupId).collection(LOOT_COLLECTION_NAME).doc(lootId);
  
  return lootRef.set({
    ...lootData,
    updated: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true }).catch((error) => {
    console.error('Error updating item: ', error);
  });
};
