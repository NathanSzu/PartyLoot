import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { GroupContext } from './GroupContext';
import fb from 'firebase';

export const GlobalFeatures = React.createContext();

export const GlobalFeaturesProvider = ({ children }) => {
  const { db } = useContext(AuthContext);
  const { currentGroup } = useContext(GroupContext);

  const historyRef = db.collection('groups').doc(currentGroup).collection('history');

  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState('Notification content');
  const [toastHeader, setToastHeader] = useState('Notification');
  const [expandNavbar, setExpandNavbar] = useState('false');

  const defaultColors = ['#ffbb00', '#bdbdbd', '#d27e1e', '#ffffff', '#ffffff', '#ffffff'];
  const currencyKeys = ['currency1', 'currency2', 'currency3', 'currency4', 'currency5', 'currency6'];

  const toggleShowToast = () => setShowToast(!showToast);

  const writeHistoryEvent = async (completedBy, action, data = {}) => {
    let summary = '';

    switch (action) {
      case 'createItem':
        summary = `created ${data.itemName} for ${data.owner}`;
        break;

      case 'sellItem':
        summary =
          `sold ${data.qty} ${data.itemName}(s) for ${data.currency[0]}, ${data.currency[1]}, ` +
          `${data.currency[2]}, ${data.currency[3]}, ${data.currency[4]}, ${data.currency[5]} ` +
          `and gave the money to ${data.seller}`;
        break;

      case 'addPartyMember':
        summary = `added ${data.name} to the party`;
        break;

      case 'deletePartyMember':
        summary = `removed ${data.name} from the party`;
        break;

      case 'editPartyMember':
        summary = `changed ${data.oldName}'s name to ${data.name}`;
        break;

      default:
        break;
    }

    historyRef.add({
      completedBy,
      action,
      summary,
      timestamp: fb.firestore.FieldValue.serverTimestamp(),
    });
  };

  return (
    <GlobalFeatures.Provider
      value={{
        showToast,
        defaultColors,
        currencyKeys,
        toggleShowToast,
        toastContent,
        setToastContent,
        toastHeader,
        expandNavbar,
        setExpandNavbar,
        setToastHeader,
        writeHistoryEvent,
      }}
    >
      {children}
    </GlobalFeatures.Provider>
  );
};
