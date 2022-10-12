import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { GroupContext } from './GroupContext';
import fb from 'firebase';

export const GlobalFeatures = React.createContext();

export const GlobalFeaturesProvider = ({ children }) => {
  const { db } = useContext(AuthContext);
  const { currentGroup } = useContext(GroupContext);

  const historyRef = db.collection('groups').doc(currentGroup).collection('history');

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState('Notification content');
  const [toastHeader, setToastHeader] = useState('Notification');

  const toggleShowToast = () => setShowToast(!showToast);
  const handleCloseRequestModal = () => setShowRequestModal(false);
  const handleShowRequestModal = () => setShowRequestModal(true);

  const writeHistoryEvent = (completedBy, action, data = {}) => {
    let summary = '';

    switch (action) {
      case 'createItem':
        summary = `created ${data.itemName} and gave it to ${data.owner || 'the party'}`
        break;
    
      default:
        break;
    }

    historyRef.add({
      completedBy,
      action,
      summary,
      timestamp: fb.firestore.FieldValue.serverTimestamp()
    })
  };

  return (
    <GlobalFeatures.Provider
      value={{
        showRequestModal,
        handleCloseRequestModal,
        handleShowRequestModal,
        showToast,
        toggleShowToast,
        toastContent,
        setToastContent,
        toastHeader,
        setToastHeader,
        writeHistoryEvent
      }}
    >
      {children}
    </GlobalFeatures.Provider>
  );
};
