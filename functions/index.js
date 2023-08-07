/**
 * Import function triggers from their respective submodules:
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {
  onDocumentWritten,
  // onDocumentCreated,
  // onDocumentUpdated,
  // onDocumentDeleted,
} = require('firebase-functions/v2/firestore');

const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();
const db = getFirestore();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info('Hello logs!', { structuredData: true });
  console.log('HELLO THERE')
  response.send('Hello from Firebase!');
});

exports.recordLikeWrite = onDocumentWritten('compendium/{item}/likes/{like}', (event) => {
  const data = event.data.after.data();

  logger.info('Afterdata');
  logger.info(data);
  console.log(data);
  db.doc('testLog/testDocWrite').set({ count: 0 });
});

exports.logTest = onDocumentWritten('compendium/{item}', (event) => {
  console.log('console log');
  logger.info('logger info');
});
