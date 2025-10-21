import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  setDoc, 
  query, 
  where, 
  onSnapshot, 
  documentId, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { db } from '../utils/firebase';

const groupCollection = collection(db, 'groups');

export const getGroupMembers = async (members, setGroupMembers, setLoading) => {
  setLoading(true);
  const q = query(
    collection(db, 'users'),
    where(documentId(), 'in', members)
  );
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let results = [];
    querySnapshot.forEach((doc) => {
      results.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    setGroupMembers(results);
    setLoading(false);
  });
  
  return unsubscribe; // Return unsubscribe function for cleanup
};

export const editGroup = async (id, values, handleClose, setLoading) => {
  setLoading(true);
  try {
    await setDoc(doc(groupCollection, id), values, { merge: true });
    handleClose && handleClose();
    setLoading(false);
  } catch (error) {
    console.error('Error updating document: ', error);
    setLoading(false);
  }
};

export const deleteGroup = async (currentUser, owner, setLoading, id, handleClose) => {
  if (currentUser.uid !== owner) return;
  setLoading(true);
  await fetch(import.meta.env.VITE_DELETE_GROUP_URL, {
    method: 'POST',
    body: id,
  });
  handleClose();
  setLoading(false);
};

// Add member
export const addMember = async (memberRef, groupMembers, setAlert, setLoading, id, setFalse) => {
  if (!memberRef.current.value) return;
  if (groupMembers.length > 9) {
    setAlert('No more than 10 members can be added');
    return;
  }
  setLoading(true);
  
  try {
    const q = query(
      collection(db, 'users'),
      where('code', '==', memberRef.current.value.toUpperCase())
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      setAlert('User not found!');
    } else {
      querySnapshot.forEach(async (docSnap) => {
        await updateDoc(doc(groupCollection, id), {
          members: arrayUnion(docSnap.id),
        });
      });
      memberRef.current.value = '';
      setFalse();
    }
    setLoading(false);
  } catch (error) {
    console.error('Error getting user: ', error);
    setLoading(false);
  }
};

// Remove member
export const removeMember = async (id, uid, setLoading, handleClose, close = false) => {
  setLoading(true);
  try {
    await updateDoc(doc(groupCollection, id), {
      members: arrayRemove(uid),
    });
    close && handleClose();
    setLoading(false);
  } catch (error) {
    console.error('Error removing member: ', error);
    setLoading(false);
  }
};
