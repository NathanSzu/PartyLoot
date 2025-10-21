import React, { useContext } from 'react';
import { Toast } from 'react-bootstrap';
import { GlobalFeatures } from '../../utils/contexts/GlobalFeatures';

export default function BootToast() {
    const { showToast, toggleShowToast, toastContent, toastHeader } = useContext(GlobalFeatures)

    return (
        <div className='position-fixed top-layer w-100 mt-3 z-1051'>
            <Toast className='mx-auto border border-dark text-dark bg-light'show={showToast} onClose={toggleShowToast} delay={8000} autohide>
                <Toast.Header className='justify-content-between bg-dark bg-gradient text-light border border-light btn-close-white' closeVariant='white' >
                    <strong className="me-auto">{toastHeader}</strong>
                </Toast.Header>
                <Toast.Body>{toastContent}</Toast.Body>
            </Toast>
        </div>
    )
}
