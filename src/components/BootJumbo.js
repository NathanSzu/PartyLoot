import React from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

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
