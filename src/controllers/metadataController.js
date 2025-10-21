import { collection, query, where, orderBy, getDocs, getFirestore } from 'firebase/firestore';
import { db } from '../utils/firebase';

export const getFilterFields = async () => {
  let results = [];

  const q = query(
    collection(db, 'metadata'),
    where('metadataCategory', '==', 'filterFields'),
    orderBy('name', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    results.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  return results;
};

export const getSettingByName = async (name) => {
  const q = query(
    collection(db, 'metadata'),
    where('name', '==', name)
  );
  
  const querySnapshot = await getDocs(q);
  let result = null;
  querySnapshot.forEach((doc) => {
    result = {
      ...doc.data(),
      id: doc.id,
    };
  });
  return result;
}