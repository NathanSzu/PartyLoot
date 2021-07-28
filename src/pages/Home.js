import React, { useState } from 'react';
import Jumbotron from '../components/JumbotronWelcome';
import Login from '../components/BootLogin';
import { Row, Col } from 'react-bootstrap';

export default function Home() {
    
    const [login, setLogin] = useState(null)
    const [welcome, setWelcome] = useState(true)

    return (
        <div className='pt-3'>
            { welcome ? <Jumbotron setLogin={setLogin} setWelcome={setWelcome} /> : null}
            <Row className="justify-content-md-center">
                <Col md={6}>
                    {!welcome ? <Login login={login} setLogin={setLogin} /> : null}
                </Col>
            </Row>
        </div>
    )
}
