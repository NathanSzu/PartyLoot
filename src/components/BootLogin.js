import React, { useState } from 'react'
import { Form, Button} from 'react-bootstrap'

// Importing and initializing firebase from utils/firebase config file.
import app from '../utils/firebase'

export default function BootLogin({ login, setLogin }) {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [checkPassword, setCheckPassword] = useState(null)
    const [emailValid, setEmailValid] = useState(null)
    const [passwordMatch, setPasswordMatch] = useState(null)

    const toggleLogin = () => {
        if (login) { setLogin(false) }
        else { setLogin(true) }
    }

    const test = () => {
        console.log('email: ', email)
        console.log('password: ', password)
        console.log('checkPassword: ', checkPassword)
        console.log('validEmail: ', emailValid)
        console.log('validPassword: ', passwordMatch)
    }

    const validateEmail = (e) => {
        const emailRequirements = /[a-z0-9]+@+[a-z0-9]+[.]+[a-z0-9]/;
        if (!emailRequirements.test(e.target.value)) {
            setEmailValid(false)
        } else {
            setEmailValid(true)
        }
    }

    const validatePassword = (e) => {
        if (password === checkPassword) {
            setPasswordMatch(true)
        } else {
            setPasswordMatch(false)
        }
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
                <Form.Control type="email" placeholder="Enter email" onChange={(e) => {setEmail(e.target.value);  validateEmail(e)}} />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
            </Form.Text>
            </Form.Group>

            <Form.Group controlId="Password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} />
            </Form.Group>

            { !login ?
                < Form.Group controlId="PasswordConfirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" onChange={(e) => {setCheckPassword(e.target.value); validatePassword()}} />
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
                    <Button variant="dark" type="submit" onClick={(e) => {e.preventDefault(); test()}} >
                        Login
                    </Button>
                    :
                    <Button variant="dark" type="submit" onClick={(e) => {e.preventDefault(); test()}} >
                        Create Account
                    </Button>
            }

        </Form >
    )
}
