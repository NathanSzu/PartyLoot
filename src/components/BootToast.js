import React, { useContext } from 'react';
import { Toast } from 'react-bootstrap';
import { GlobalFeatures } from '../utils/contexts/GlobalFeatures';

export default function BootToast() {
    const { showToast, toggleShowToast, toastContent, toastHeader } = useContext(GlobalFeatures)

    return (
        <div className='position-fixed top-layer w-100 mt-3'>
            <Toast className='ml-auto mr-auto background-light' show={showToast} onClose={toggleShowToast} delay={15000} autohide>
                <Toast.Header className='justify-content-between'>
                    <strong className="me-auto">{toastHeader}</strong>
                </Toast.Header>
                <Toast.Body>{toastContent}</Toast.Body>
            </Toast>
        </div>
    )
}
