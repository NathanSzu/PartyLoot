import React, { useState } from 'react';
import BootJumbo from '../components/BootJumbo';
import BootLogin from '../components/BootLogin';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Home() {
    const [login, setLogin] = useState(null)
    const [welcome, setWelcome] = useState(true)

    return (
        <>
            { welcome ? <BootJumbo setLogin={setLogin} setWelcome={setWelcome} /> : null}
            <Row className="justify-content-md-center">
                <Col md={6}>
                    {!welcome ? <BootLogin login={login} setLogin={setLogin} /> : null}
                </Col>
            </Row>
        </>
    )
}
