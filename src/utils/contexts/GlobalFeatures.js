import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { GroupContext } from './GroupContext';

export const GlobalFeatures = React.createContext();

export const GlobalFeaturesProvider = ({ children }) => {
  const { db } = useContext(AuthContext);
  const { currentGroup, groupData } = useContext(GroupContext);

  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState('Notification content');
  const [toastHeader, setToastHeader] = useState('Notification');
  const [expandNavbar, setExpandNavbar] = useState('false');

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

  const setHistory = (history, newRecord) => {
    if (history && history.length > 0) {
      history = [newRecord, ...history];
      history.length > 50 && history.pop();
    } else {
      history = [newRecord];
    }
    return history;
  };

  const writeHistoryEvent = async (completedBy, action, data = {}, groupId = currentGroup) => {
    let summary = '';
    let timestamp = new Date();

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

      case 'updateCurrency':
        summary = `updated currency totals for ${data.itemOwner}: ${data.oldCurrency[0]} -> ${data.newCurrency[0]}, ${data.oldCurrency[1]} -> ${data.newCurrency[1]}, ${data.oldCurrency[2]} -> ${data.newCurrency[2]}, ${data.oldCurrency[3]} -> ${data.newCurrency[3]}, ${data.oldCurrency[4]} -> ${data.newCurrency[4]}, ${data.oldCurrency[5]} -> ${data.newCurrency[5]}.`;
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

      case 'addFromCompendium':
        summary = `added ${data.itemName} from the compendium`;
        break;

      default:
        break;
    }

    db.collection('groups')
      .doc(groupId)
      .set(
        {
          history: setHistory(groupData?.history, {
            completedBy,
            action,
            summary,
            timestamp: timestamp.toDateString(),
          }),
        },
        { merge: true }
      );
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
        .replace(/( - )/g, '<br>- ');

      return `<p><em>${selection.type} ${selection.requires_attunement}</em></p><p>${modifiedStr}</p>`;
    }
  };

  const checkLocalStorage = (key, set = false) => {
    let localStoragePLT = localStorage.getItem('plt');
    let storageObj = JSON.parse(localStoragePLT) || {};
    if (storageObj[key]) return true;
    if (set) {
      storageObj[key] = true;
      localStorage.setItem('plt', JSON.stringify(storageObj));
    }
    return false;
  };

  const clearLocalStorageItems = (keysArr) => {
    let localStoragePLT = localStorage.getItem('plt');
    let storageObj = JSON.parse(localStoragePLT) || {};
    keysArr.forEach((key) => {
      delete storageObj[key]
    });
    localStorage.setItem('plt', JSON.stringify(storageObj));
  };

  return (
    <GlobalFeatures.Provider
      value={{
        showToast,
        defaultColors,
        currencyKeys,
        toggleShowToast,
        setShowToast,
        isVisible,
        toastContent,
        setToastContent,
        toastHeader,
        expandNavbar,
        setExpandNavbar,
        setToastHeader,
        writeHistoryEvent,
        formatItemDescription,
        checkLocalStorage,
        clearLocalStorageItems
      }}
    >
      {children}
    </GlobalFeatures.Provider>
  );
};
