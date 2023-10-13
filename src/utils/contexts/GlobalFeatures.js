import React, { useState, useContext, useEffect } from 'react';
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
  const [itemMetadata, setItemMetadata] = useState({});

  const defaultColors = ['#ffbb00', '#bdbdbd', '#d27e1e', '#ffffff', '#ffffff', '#ffffff'];
  const currencyKeys = ['currency1', 'currency2', 'currency3', 'currency4', 'currency5', 'currency6'];

  const toggleShowToast = () => setShowToast(!showToast);

  const isVisible = (elementSelector) => {
    if (!elementSelector) {
      return false;
    }
    const element = document.querySelector(elementSelector);
    if (!element) return;
    const rect = element.getBoundingClientRect();

    const isInViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    return isInViewport;
  };

  const getItemMetadata = () => {
    db.collection('metadata')
      .doc('items')
      .get()
      .then((doc) => {
        setItemMetadata(doc.data());
      });
  };

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

  const formatItemDescription = (selection) => {
    if (selection?.itemDesc) return selection.itemDesc;
    if (selection?.desc) {
      let modifiedStr = selection.desc
        .replace(/(\*\*_)/g, '</p><p><strong>')
        .replace(/(_\*\*)/g, '</strong>')
        .replace(/( _)/g, ' <u>')
        .replace(/(_ )/g, '</u> ')
        .replace(/(_.)/g, '</u> ')
        .replace(/( - )/g, '<br>- ')

      return `<p><em>${selection.type} ${selection.requires_attunement}</em></p><p>${modifiedStr}</p>`;
    }
  };

  useEffect(() => {
    getItemMetadata();
  }, []);

  return (
    <GlobalFeatures.Provider
      value={{
        showToast,
        defaultColors,
        currencyKeys,
        toggleShowToast,
        isVisible,
        toastContent,
        setToastContent,
        toastHeader,
        expandNavbar,
        setExpandNavbar,
        setToastHeader,
        writeHistoryEvent,
        formatItemDescription,
        itemMetadata,
      }}
    >
      {children}
    </GlobalFeatures.Provider>
  );
};
