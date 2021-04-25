import React, { useState, useRef } from 'react'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

// Importing and initializing firebase from utils/firebase config file.
import app from '../utils/firebase'

export default function PasswordReset() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(null);
    const [emailValid, setEmailValid] = useState(true);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const emailRef = useRef(false);

    // This checks that the email field conforms to a basic format before allowing the send email function to execute.
    const validateEmail = (e) => {
        const emailRequirements = /[a-z0-9]+@+[a-z0-9]+[.]+[a-z0-9]/;
        if (!emailRequirements.test(e.target.value)) {
            setEmailValid(false)
        } else { setEmailValid(true) }
    }

    const passwordReset = () => {
        if (!emailRef.current.value) return
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

        <Row className="justify-content-md-center">
            <Col md={6}>
                <Form>
                    <Form.Group controlId="Email">
                        <Form.Label>Email address</Form.Label>

                        {
                            emailValid ? null :
                                <Alert variant={'warning'}>Please enter a valid email address.</Alert>
                        }

{
                            !resetEmailSent ? null :
                                <Alert variant={'success'}>Your email has been sent. Please check your inbox!</Alert>
                        }

                        <Form.Control ref={emailRef} type="email" placeholder="Enter email" onChange={(e) => { setEmail(e.target.value); validateEmail(e) }} />
                        <Form.Text className="text-muted">
                            If we have an account with this email, we will send a link to reset your password.
                        </Form.Text>
                    </Form.Group>

                    <Row className='justify-content-center'>
                        <Col className='text-center mt-3'>
                            <Button disabled={loading} variant="dark" type="submit" onClick={(e) => { e.preventDefault(); passwordReset() }} >
                                Reset password!
                            </Button>
                        </Col>
                    </Row>
                </Form >
            </Col>
        </Row>
    )
}
