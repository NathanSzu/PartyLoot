import React, { useEffect, useState } from 'react';

export const GroupContext = React.createContext();

export const GroupProvider = ({ children }) => {
    const [currentGroup, setCurrentGroup] = useState(null)
    const [loading, setLoading] = useState(false)

    return (
        <GroupContext.Provider
        value={{currentGroup, setCurrentGroup}}
        >
            {!loading && children}
        </GroupContext.Provider>
    );
}
