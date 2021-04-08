import React from 'react'
import { Jumbotron, Container, Button } from 'react-bootstrap';

export default function BootJumbo({ setWelcome, setLogin }) {
    const showForms = () => {
        setWelcome(false)
        setLogin(true)
    }

    return (
        <Jumbotron fluid>
            <Container>
                <h1>Fluid jumbotron</h1>
                <p>
                    This is a modified jumbotron that occupies the entire horizontal space of
                    its parent.
                </p>
                <Button variant='dark' onClick={showForms} >Login</Button>
            </Container>
        </Jumbotron>
    )
}
