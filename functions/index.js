/**
 * Import function triggers from their respective submodules:
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { logger } = require('firebase-functions');
// const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated, onDocumentDeleted } = require('firebase-functions/v2/firestore');

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const FieldValue = require('firebase-admin').firestore.FieldValue;

initializeApp();
const db = getFirestore();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.docCreatedTest = onDocumentCreated('compendium/{item}/likes/{like}', (event) => {
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

exports.docRemovedTest = onDocumentDeleted('compendium/{item}/likes/{like}', (event) => {
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
