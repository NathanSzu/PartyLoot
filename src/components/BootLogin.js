import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../utils/AuthContext';

// Importing and initializing firebase from utils/firebase config file.
import app from '../utils/firebase'

export default function BootLogin({ login, setLogin, user }) {
    const { currentUser } = useContext(AuthContext)

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [checkPassword, setCheckPassword] = useState(null);
    const [emailValid, setEmailValid] = useState('empty');
    const [passwordValid, setPasswordValid] = useState('empty');
    const [passwordLengthValid, setPasswordLengthValid] = useState('empty');
    const [loading, setLoading] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const toggleLogin = () => {
        if (login) { setLogin(false) }
        else { setLogin(true) }
    }

    const validateEmail = (e) => {
        const emailRequirements = /[a-z0-9]+@+[a-z0-9]+[.]+[a-z0-9]/;
        if (!emailRequirements.test(e.target.value)) {
            setEmailValid(false)
        } else {
            setEmailValid(true)
        }
    }

    const validatePassword2 = (e) => {
        if (password === e.target.value) {
            setPasswordValid(true)
        } else {
            setPasswordValid(false)
        }
    }

    const validatePassword1 = (e) => {
        if (checkPassword === e.target.value) {
            setPasswordValid(true)
        } else {
            setPasswordValid(false)
        }
    }

    const validatePasswordLength = (e) => {
        if (e.target.value.length > 7) {
            setPasswordLengthValid(true)
        } else {
            setPasswordLengthValid(false)
        }
    }

    const signUp = () => {
        if (emailValid && passwordValid && passwordLengthValid) {
            setLoading(true);
            app.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in 
                    var user = userCredential.user;
                    // ...
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error.code)
                    console.log(error.message)
                });
        }
    }

    const logIn = () => {
        if (emailValid) {
            setLoading(true);
            app.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    var user = userCredential.user;
                    // ...
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error.code)
                    console.log(error.message)
                    setLoading(false);
                });
        }
    }

    const passwordReset = () => {
        if (emailValid) {
            setLoading(true);
            app.auth().sendPasswordResetEmail(email).then(function () {
                // Email sent.
                setResetEmailSent(true);
                setLoading(false);
            }).catch(function (error) {
                // An error happened.
                setLoading(false);
            });
        }
    }

    return (
        <Form>
            <Form.Group controlId="Email">
                <Form.Label>Email address</Form.Label>

                {
                    emailValid ? null :
                        <Alert variant={'warning'}>Please enter a valid email address.</Alert>
                }

                <Form.Control type="email" placeholder="Enter email" onChange={(e) => { setEmail(e.target.value); validateEmail(e) }} />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
            </Form.Text>
            </Form.Group>

            <Form.Group controlId="Password">
                <Form.Label>Password</Form.Label>

                {
                    passwordLengthValid ? null :
                        <Alert variant={'warning'}>Must be at least 8 characters!</Alert>
                }

                <Form.Control type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value); validatePassword1(e); validatePasswordLength(e) }} />
            </Form.Group>

            { !login ?
                < Form.Group controlId="PasswordConfirm">
                    <Form.Label>Confirm Password</Form.Label>

                    {
                        passwordValid ? null :
                            <Alert variant={'warning'}>Passwords must match!</Alert>
                    }

                    <Form.Control type="password" placeholder="Confirm Password" onChange={(e) => { setCheckPassword(e.target.value); validatePassword2(e) }} />
                </Form.Group>
                :
                null
            }

            <Row className='justify-content-between'>
                <Col className='text-center'>
                    {!login ? 'Already have an account?' : 'Need to create an account?'}
                    <Button variant="link" onClick={toggleLogin}>
                        {!login ? 'Login here!' : 'Sign up here!'}
                    </Button>
                </Col>
            </Row>

            {
                login ?
                    <>
                        <Row>
                            <Col className='text-center mt-3 mb-3'>
                                <Button disabled={loading} variant="dark" type="submit" onClick={(e) => { e.preventDefault(); test(); logIn() }} >
                                    Login
                                </Button>
                            </Col>
                        </Row>
                        <Row className='justify-content-center'>
                            <Button variant="link" onClick={passwordReset}>
                                Send a password reset email.
                            </Button>
                        </Row>
                    </>
                    :
                    <Row className='justify-content-center'>
                        <Col className='text-center mt-3'>
                        <Button disabled={loading} variant="dark" type="submit" onClick={(e) => { e.preventDefault(); test(); signUp() }} >
                            Create Account
                        </Button>
                        </Col>
                    </Row>
            }
        </Form >
    )
}
