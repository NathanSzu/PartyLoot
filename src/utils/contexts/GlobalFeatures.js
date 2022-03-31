import React, { useState } from "react";

export const GlobalFeatures = React.createContext();

export const GlobalFeaturesProvider = ({ children }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState("Notification content");
  const [toastHeader, setToastHeader] = useState("Notification");

  const toggleShowToast = () => setShowToast(!showToast);
  const handleCloseRequestModal = () => setShowRequestModal(false);
  const handleShowRequestModal = () => setShowRequestModal(true);

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
      }}
    >
      {children}
    </GlobalFeatures.Provider>
  );
};
