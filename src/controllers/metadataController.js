import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export const getFilterFields = async () => {
  let results = [];

  const querySnapshot = await db.collection('metadata').where('metadataCategory', '==', 'filterFields').orderBy('name', 'asc').get();
  querySnapshot.forEach((doc) => {
    results.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  return results;
};

export const getSettingByName = async (name) => {
  const querySnapshot = await db.collection('metadata').where('name', '==', name).get();
  let result = null;
  querySnapshot.forEach((doc) => {
    result = {
      ...doc.data(),
      id: doc.id,
    };
  });
  return result;
}