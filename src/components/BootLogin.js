import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function BootLogin({ login, setLogin }) {
    const toggleLogin = () => {
        if (login) { setLogin(false) }
        else { setLogin(true) }
    }

    return (
        <Form>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
            </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            { !login ?
                < Form.Group controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
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
