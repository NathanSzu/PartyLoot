import React, { useEffect, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from '../utils/firebase';

export const GroupContext = React.createContext();

export const GroupProvider = ({ children }) => {
    const db = firebase.firestore();
    const [currentGroup, setCurrentGroup] = useState('wJ2STtvDmLVncgiNscUt')
    const [loading, setLoading] = useState(false)
    const [groupData] = useDocumentData(db.collection('groups').doc(currentGroup));

    return (
        <GroupContext.Provider
        value={{currentGroup, setCurrentGroup, groupData}}
        >
            {!loading && children}
        </GroupContext.Provider>
    );
}
