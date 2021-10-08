import React, { useState, useRef } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Importing and initializing firebase from utils/firebase config file.
import app from '../utils/firebase'

export default function BootLogin({ login, setLogin }) {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [checkPassword, setCheckPassword] = useState(null);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState('empty');
    const [passwordLengthValid, setPasswordLengthValid] = useState('empty');
    const [noUser, setNoUser] = useState(false);
    const [loading, setLoading] = useState(false);

    const emailRef = useRef(false);
    const passwordRef = useRef(false);

    // Sets the login form display state. This affects which input components are displayed.
    const toggleLogin = () => {
        if (login) { setLogin(false) }
        else { setLogin(true) }
    }

    // This checks that the email field conforms to a basic format before allowing the create user function to execute.
    const validateEmail = (e) => {
        const emailRequirements = /[a-z0-9]+@+[a-z0-9]+[.]+[a-z0-9]/;
        if (!emailRequirements.test(e.target.value)) {
            setEmailValid(false)
        } else { setEmailValid(true) }
    }

    // Checks that the two password fields match before executing the create user firebase method.
    const validatePassword2 = (e) => {
        if (password === e.target.value) {
            setPasswordValid(true)
        } else { setPasswordValid(false) }
    }

    // Checks that the two password fields match before executing the create user firebase method.
    // Two are needed in order to handle separate error message displays for each field.
    const validatePassword1 = (e) => {
        if (checkPassword === e.target.value) {
            setPasswordValid(true)
        } else { setPasswordValid(false) }
    }

    // Verifies that the password entered is at least 8 characters before account creation.
    const validatePasswordLength = (e) => {
        if (e.target.value.length > 7) {
            setPasswordLengthValid(true)
        } else { setPasswordLengthValid(false) }
    }

    // Executes the firebase create user function after all checks are passed.
    const signUp = () => {
        if (!emailRef.current.value) return;
        if (!passwordRef.current.value) return;
        if (emailValid && passwordValid && passwordLengthValid) {
            setLoading(true);
            app.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in 
                    // var user = userCredential.user;
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

    // Executes the firebase login user function after all checks are passed.
    const logIn = () => {
        if (!emailRef.current.value) return;
        if (!passwordRef.current.value) return;
        if (emailValid) {
            setLoading(true);
            app.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    // var user = userCredential.user;
                    // ...
                    setLoading(false);
                })
                .catch((error) => {
                    setNoUser(true);
                    console.log(error.code);
                    console.log(error.message);
                    setLoading(false);
                });
        }
    }

    return (
        <Form className='add-background-light p-3 rounded-bottom'>
            {noUser ? <Alert className='text-center' variant={'warning'}>Invalid email or password.</Alert> : null}
            <Form.Group controlId="Email">
                <Form.Label>Email address</Form.Label>

                {emailValid ? null : <Alert variant={'warning'}>Please enter a valid email address.</Alert>}

                <Form.Control ref={emailRef} type="email" placeholder="Enter email" onChange={(e) => { setEmail(e.target.value); validateEmail(e) }} />
                <Form.Text className="text-dark">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="Password">
                <Form.Label>Password</Form.Label>

                {passwordLengthValid || login ? null : <Alert variant={'warning'}>Must be at least 8 characters!</Alert>}

                <Form.Control ref={passwordRef} type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value); validatePassword1(e); validatePasswordLength(e) }} />
            </Form.Group>

            {!login ?
                < Form.Group controlId="PasswordConfirm">
                    <Form.Label>Confirm Password</Form.Label>

                    {passwordValid ? null : <Alert variant={'warning'}>Passwords must match!</Alert>}

                    <Form.Control type="password" placeholder="Confirm Password" onChange={(e) => { setCheckPassword(e.target.value); validatePassword2(e) }} />
                </Form.Group>
                :
                null
            }

            <Row className='justify-content-between'>
                <Col className='text-center'>
                    {!login ? 'Already have an account?' : 'Need to create an account?'}
                    <Button variant="link" onClick={() => {toggleLogin()}}>
                        {!login ? 'Login here!' : 'Sign up here!'}
                    </Button>
                </Col>
            </Row>

            {
                login ?
                    <>
                        <Row>
                            <Col className='text-center mt-3 mb-3'>
                                <Button disabled={loading} variant="dark" type="submit" onClick={(e) => { e.preventDefault(); logIn() }} >
                                    Login
                                </Button>
                            </Col>
                        </Row>
                        <Row className='justify-content-center'>
                            <Link to='/forgot-password'>
                                <Button variant="link">
                                    Forgot password?
                                </Button>
                            </Link>
                        </Row>
                    </>
                    :
                    <Row className='justify-content-center'>
                        <Col className='text-center mt-3'>
                            <Button disabled={loading} variant="dark" type="submit" onClick={(e) => { e.preventDefault(); signUp() }} >
                                Create Account
                            </Button>
                        </Col>
                    </Row>
            }
        </Form >
    )
}
