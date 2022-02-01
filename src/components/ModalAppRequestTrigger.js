import React, { useContext } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { GlobalFeatures } from '../utils/contexts/GlobalFeatures';

export default function ModalAppRequestTrigger({ type }) {
    const { handleShowRequestModal } = useContext(GlobalFeatures)

    return (
        <>
            {type ?
                <Nav.Link onClick={handleShowRequestModal}>Request Feature / Report Bug</Nav.Link>
                :
                <Button variant={'dark'} className={'p-2 mb-2 w-100 background-dark border-0'} onClick={handleShowRequestModal}>Request Feature / Report Bug</Button>
            }
        </>
    )
}
