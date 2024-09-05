const axios = require('axios');
const { logger } = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated, onDocumentDeleted } = require('firebase-functions/v2/firestore');
const { deleteGroup } = require('./src/deleteGroup');

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

initializeApp();
const db = getFirestore();

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

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject('Failed to create access token :(');
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_USER,
      accessToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  return transporter;
};

const send = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

exports.reportNotification = onDocumentCreated('communications/{documentId}', (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log('No data associated with the event');
    return;
  }

  const data = snapshot.data();

  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to: process.env.EMAIL,
    subject: `Party Loot ${data.action}`,
    html: `<h1>New ${data.action} Message!</h1><p>From: ${data.username}</p><p>Email: ${data.email}</p><p>Description: ${data.description}</p>`,
  };

  send(mailOptions);
});


exports.deleteGroupTrigger = onRequest({ cors: true }, (req, res) => deleteGroup(req,res));
