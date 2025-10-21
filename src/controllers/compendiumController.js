import { 
  collection, 
  serverTimestamp,
  query,
  where,
  orderBy,
  startAfter,
  endBefore,
  limitToLast,
  limit,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../utils/firebase';

const buildCompendiumQuery = (params) => {
  const searchFilterLower = params.search.toLowerCase() || '';
  let q = query(collection(db, 'compendium'));

  if (!params.creatorId) q = query(q, where('published', '==', true));

  if (params.type) q = query(q, where('type', '==', params.type));
  if (params.rarity) q = query(q, where('rarity', '==', params.rarity));

  q = query(q,
    where('itemNameLower', '>=', searchFilterLower),
    where('itemNameLower', '<=', searchFilterLower + '\uf8ff')
  );

  if (params.creatorId) q = query(q, where('creatorId', '==', params.creatorId));

  q = query(q, orderBy('itemNameLower'));

  return q;
};

const applyPagination = (q, params, limitCount) => {
  const constraints = [];
  
  if (params.nextPage) {
    constraints.push(startAfter(params.nextPage));
  } else if (params.prevPage) {
    constraints.push(endBefore(params.prevPage));
    constraints.push(limitToLast(limitCount));
    return query(q, ...constraints);
  }
  
  constraints.push(limit(limitCount));
  return query(q, ...constraints);
};

const hasNextItem = async (next, params) => {
  if (!next) {
    return null;
  }

  const q = query(buildCompendiumQuery(params), startAfter(next), limit(1));

  return getDocs(q).then((querySnapshot) => {
    if (!querySnapshot.empty) return next;
  });
};

const hasPreviousItem = async (previous, params) => {
  if (!previous) {
    return null;
  }

  const q = query(buildCompendiumQuery(params), endBefore(previous), limitToLast(1));

  return getDocs(q).then((querySnapshot) => {
    if (!querySnapshot.empty) return previous;
  });
};

export const searchCompendium = async (queryParams, limitCount = 10) => {
  const q = applyPagination(buildCompendiumQuery(queryParams), queryParams, limitCount);

  const querySnapshot = await getDocs(q);
  let results = [];
  querySnapshot.forEach((docSnap) => {
    results.push({
      ...docSnap.data(),
      id: docSnap.id,
    });
  });

  const next = results.length > 0 && await hasNextItem(results[results.length - 1]?.itemNameLower, queryParams);

  const previous = results.length > 0 && await hasPreviousItem(results[0]?.itemNameLower, queryParams);

  return { results, next, previous };
};

export const isLiked = async (itemId, userId) => {
  const itemRef = doc(db, 'compendium', itemId);
  const collectionRef = collection(itemRef, 'likes');
  const docSnap = await getDoc(doc(collectionRef, userId));
  return docSnap.exists();
};

export const addLike = async (itemId, userId) => {
  const itemRef = doc(db, 'compendium', itemId);
  const collectionRef = collection(itemRef, 'likes');
  await setDoc(doc(collectionRef, userId), {
    timestamp: serverTimestamp(),
  });
};

export const removeLike = async (itemId, userId) => {
  const itemRef = doc(db, 'compendium', itemId);
  const collectionRef = collection(itemRef, 'likes');
  await deleteDoc(doc(collectionRef, userId));
};

export const addCompendiumItem = async (itemData) => {
  const itemRef = collection(db, 'compendium');
  await addDoc(itemRef, { ...itemData, created: serverTimestamp() });
};

export const updateCompendiumItem = async (itemId, itemData) => {
  const itemRef = doc(db, 'compendium', itemId);
  await updateDoc(itemRef, { ...itemData, updated: serverTimestamp() });
};

export const deleteCompendiumItem = async (itemId) => {
  const itemRef = doc(db, 'compendium', itemId);
  await deleteDoc(itemRef);
};
