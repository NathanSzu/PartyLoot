import React, { useState, useEffect } from 'react';
import BootJumbo from '../components/BootJumbo';
import BootLogin from '../components/BootLogin';
import { Row, Col } from 'react-bootstrap';
import firebase from '../utils/firebase';

export default function Home() {
    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              setUser(user)
              console.log(user.email)
            } else {
              // No user is signed in.
            }
          });
    }, [])

    const [user, setUser] = useState(null)
    const [login, setLogin] = useState(null)
    const [welcome, setWelcome] = useState(true)

    return (
        <>
            { welcome ? <BootJumbo setLogin={setLogin} setWelcome={setWelcome} /> : null}
            <Row className="justify-content-md-center">
                <Col md={6}>
                    {!welcome ? <BootLogin login={login} setLogin={setLogin} user={user} /> : null}
                </Col>
            </Row>
        </>
    )
}
