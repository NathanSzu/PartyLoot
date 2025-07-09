import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();
const groupCollection = db.collection('groups');

export const getGroupMembers = async (members, setGroupMembers, setLoading) => {
  setLoading(true);
  await db
    .collection('users')
    .where(firebase.firestore.FieldPath.documentId(), 'in', members)
    .onSnapshot((querySnapshot) => {
      let results = [];
      querySnapshot.forEach((doc) => {
        results.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setGroupMembers(results);
    });
  setLoading(false);
};

export const editGroup = (id, values, handleClose, setLoading) => {
  setLoading(true);
  groupCollection
    .doc(id)
    .set({ ...values }, { merge: true })
    .then(() => {
      handleClose && handleClose();
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error updating document: ', error);
      setLoading(false);
    });
};

export const deleteGroup = async (currentUser, owner, setLoading, id, handleClose) => {
  if (currentUser.uid !== owner) return;
  setLoading(true);
  await fetch(process.env.REACT_APP_DELETE_GROUP_URL, {
    method: 'POST',
    body: id,
  });
  handleClose();
  setLoading(false);
};

// Add member
export const addMember = (memberRef, groupMembers, setAlert, setLoading, id, setFalse) => {
  if (!memberRef.current.value) return;
  if (groupMembers.length > 9) {
    setAlert('No more than 10 members can be added');
    return;
  }
  setLoading(true);
  db.collection('users')
    .where('code', '==', memberRef.current.value.toUpperCase())
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        setAlert('User not found!');
      } else {
        querySnapshot.forEach((doc) => {
          groupCollection.doc(id).update({
            members: firebase.firestore.FieldValue.arrayUnion(doc.id),
          });
        });
        memberRef.current.value = '';
        setFalse();
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error getting user: ', error);
    });
};

// Remove member
export const removeMember = (id, uid, setLoading, handleClose, close = false) => {
  setLoading(true);
  groupCollection
    .doc(id)
    .update({
      members: firebase.firestore.FieldValue.arrayRemove(uid),
    })
    .then(() => {
      close && handleClose();
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error removing member: ', error);
    });
};
