import React, { useState, useEffect } from 'react';

export const GlobalFeatures = React.createContext();

export const GlobalFeaturesProvider = ({ children }) => {
    const [showRequestModal, setShowRequestModal] = useState(false);

    const handleCloseRequestModal = () => setShowRequestModal(false);
    const handleShowRequestModal = () => setShowRequestModal(true);

    return (
        <GlobalFeatures.Provider
            value={{ showRequestModal, handleCloseRequestModal, handleShowRequestModal }}
        >
            {children}
        </GlobalFeatures.Provider>
    );
}
