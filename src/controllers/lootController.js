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

export const getLootItem = async (lootId) => {
  const db = firebase.firestore();
  const lootRef = db.collection(COLLECTION_NAME).doc(lootId);
  
  const doc = await lootRef.get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

export const getAllLootItems = async () => {
  const db = firebase.firestore();
  const lootRef = db.collection(COLLECTION_NAME);
  
  const snapshot = await lootRef.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

export const deleteLootItem = async (lootId) => {
  const db = firebase.firestore();
  const lootRef = db.collection(COLLECTION_NAME).doc(lootId);
  
  return lootRef.delete();
};

export const getLootByParty = async (partyId) => {
  const db = firebase.firestore();
  const lootRef = db.collection(COLLECTION_NAME);
  
  const snapshot = await lootRef.where('partyId', '==', partyId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getLootByCharacter = async (characterId) => {
  const db = firebase.firestore();
  const lootRef = db.collection(COLLECTION_NAME);
  
  const snapshot = await lootRef.where('characterId', '==', characterId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUnclaimedLoot = async (partyId) => {
  const db = firebase.firestore();
  const lootRef = db.collection(COLLECTION_NAME);
  
  const snapshot = await lootRef.where('claimed', '==', false).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 