const { logger } = require('firebase-functions');

const firebase_tools = require('firebase-tools');

const deleteGroup = async (req, res) => {
  const path = `groups/${req.body}`;

  logger.log('Deleting group...');

  await firebase_tools.firestore.delete(path, {
    project: process.env.REACT_APP_PROJECT_ID,
    recursive: true,
    force: true,
    token: process.env.GOOGLE_FIREBASE_TOKEN,
  });

  res.send({
    status: 200,
    message: 'Group successfully deleted',
  });
};

module.exports = {
  deleteGroup,
};
