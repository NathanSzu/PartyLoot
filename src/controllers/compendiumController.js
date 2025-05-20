import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

const buildCompendiumQuery = (params) => {
  const searchFilterLower = params.search.toLowerCase() || '';
  let query = db.collection('compendium');

  if (!params.creatorId) query = query.where('published', '==', true);

  if (params.type) query = query.where('type', '==', params.type);
  if (params.rarity) query = query.where('rarity', '==', params.rarity);

  query = query
    .where('itemNameLower', '>=', searchFilterLower)
    .where('itemNameLower', '<=', searchFilterLower + '\uf8ff');

  if (params.creatorId) query = query.where('creatorId', '==', params.creatorId);

  query = query.orderBy('itemNameLower');

  return query;
};

const applyPagination = (query, params, limit) => {
  if (params.nextPage) {
    query = query.startAfter(params.nextPage).limit(limit);
  } else if (params.prevPage) {
    query = query.endBefore(params.prevPage).limitToLast(limit);
  } else {
    query = query.limit(limit);
  }
  return query;
};

const hasNextItem = async (next, params) => {
  if (!next) {
    return null;
  }

  const query = buildCompendiumQuery(params).startAfter(next).limit(1);

  return query.get().then((querySnapshot) => {
    if (!querySnapshot.empty) return next;
  });
};

const hasPreviousItem = async (previous, params) => {
  if (!previous) {
    return null;
  }

  const query = buildCompendiumQuery(params).endBefore(previous).limitToLast(1);

  return query.get().then((querySnapshot) => {
    if (!querySnapshot.empty) return previous;
  });
};

export const searchCompendium = async (queryParams, limit = 10) => {
  const query = applyPagination(buildCompendiumQuery(queryParams, limit), queryParams, limit);

  const querySnapshot = await query.get();
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  const next = results.length > 0 && await hasNextItem(results[results.length - 1]?.itemNameLower, queryParams);

  const previous = results.length > 0 && await hasPreviousItem(results[0]?.itemNameLower, queryParams);

  return { results, next, previous };
};

export const isLiked = async (itemId, userId) => {
  const itemRef = db.collection('compendium').doc(itemId);
  const collectionRef = itemRef.collection('likes');
  const doc = await collectionRef.doc(userId).get();
  return doc.exists;
};

export const addLike = async (itemId, userId) => {
  const itemRef = db.collection('compendium').doc(itemId);
  const collectionRef = itemRef.collection('likes');
  await collectionRef.doc(userId).set({
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const removeLike = async (itemId, userId) => {
  const itemRef = db.collection('compendium').doc(itemId);
  const collectionRef = itemRef.collection('likes');
  await collectionRef.doc(userId).delete();
};

export const addCompendiumItem = async (itemData) => {
  const itemRef = db.collection('compendium');
  await itemRef.add({ ...itemData, created: firebase.firestore.FieldValue.serverTimestamp() });
};

export const updateCompendiumItem = async (itemId, itemData) => {
  const itemRef = db.collection('compendium').doc(itemId);
  await itemRef.update({ ...itemData, updated: firebase.firestore.FieldValue.serverTimestamp() });
};

export const deleteCompendiumItem = async (itemId) => {
  const itemRef = db.collection('compendium').doc(itemId);
  await itemRef.delete();
};
