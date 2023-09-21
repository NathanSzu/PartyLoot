/**
 * Import function triggers from their respective submodules:
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const axios = require('axios');

const { logger } = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated, onDocumentDeleted } = require('firebase-functions/v2/firestore');

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const FieldValue = require('firebase-admin').firestore.FieldValue;

initializeApp();
const db = getFirestore();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.compendiumLikeAdded = onDocumentCreated('compendium/{item}/likes/{like}', (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.log('No data associated with the event');
    return;
  }

  const ref = snapshot.ref;
  const itemRef = ref.parent.parent;
  const itemRefId = itemRef.id;

  db.doc(`compendium/${itemRefId}`)
    .set({ likeCount: FieldValue.increment(1) }, { merge: true })
    .catch((err) => {
      logger.error(err);
      return null;
    });
});

exports.compendiumLikeRemoved = onDocumentDeleted('compendium/{item}/likes/{like}', (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.log('No data associated with the event');
    return;
  }

  const ref = snapshot.ref;
  const itemRef = ref.parent.parent;
  const itemRefId = itemRef.id;

  db.doc(`compendium/${itemRefId}`)
    .set({ likeCount: FieldValue.increment(-1) }, { merge: true })
    .catch((err) => {
      logger.error(err);
      return null;
    });
});

exports.itemSearch = onRequest({ cors: true }, async (req, res) => {
  let results = [];

  axios
    .all([
      axios.get(`https://api.open5e.com/v1/weapons/?search=${req.body}`),
      axios.get(`https://api.open5e.com/v1/armor/?search=${req.body}`),
      axios.get(`https://api.open5e.com/v1/magicitems/?search=${req.body}`),
    ])
    .then((resArr) => {
      for (let i = 0; i < resArr.length; i++) {
        results = results.concat(resArr[i].data.results);
      }

      db.collection('compendium')
        .where('itemNameLower', '>=', req.body)
        .where('itemNameLower', '<=', req.body + '\uf8ff')
        .limit(10)
        .get()
        .then((snap) => {
          snap.forEach((item) => {
            results.push({
              ...item.data(),
              id: item.id,
              name: item.data().itemName,
              document__title: 'Compendium',
            });
          });

          results.sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
          });
          res.status(200).send(results);
        });
    });
});
