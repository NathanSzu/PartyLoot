import React, { useState } from 'react'
import { Form, Button} from 'react-bootstrap'

// Importing and initializing firebase from utils/firebase config file.
import app from '../utils/firebase'

export default function BootLogin({ login, setLogin }) {

    const toggleLogin = () => {
        if (login) { setLogin(false) }
        else { setLogin(true) }
    }
    var email;
    var password;

    const test = () => {
        console.log(email)
    }

    const signUp = () => {
        app.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                // ..
            });
    }

    const logIn = () => {
        app.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
    }

    return (
        <Form>
            <Form.Group controlId="Email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
            </Form.Text>
            </Form.Group>

            <Form.Group controlId="Password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            { !login ?
                < Form.Group controlId="PasswordConfirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" />
                </Form.Group>
                :
                null
            }

            <div>
                {!login ? 'Already have an account?' : 'Need to create an account?'}
                <Button variant="link" onClick={toggleLogin}>
                    {!login ? 'Login here!' : 'Sign up here!'}
                </Button>
            </div>

            {
                login ?
                    <Button variant="dark" type="submit">
                        Login
                    </Button>
                    :
                    <Button variant="dark" type="submit">
                        Create Account
                    </Button>
            }

        </Form >
    )
}
