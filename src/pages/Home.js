import React, { useState, useEffect } from 'react';
import Jumbotron from '../components/BootJumbo';
import Login from '../components/BootLogin';
import { Row, Col } from 'react-bootstrap';
import firebase from '../utils/firebase';

export default function Home() {
    // useEffect(() => {
    //     firebase.auth().onAuthStateChanged(function(user) {
    //         if (user) {
    //           // User is signed in.
    //           setUser(user)
    //           console.log(user.email)
    //         } else {
    //           // No user is signed in.
    //         }
    //       });
    // }, [])

    // const [user, setUser] = useState(null)
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
