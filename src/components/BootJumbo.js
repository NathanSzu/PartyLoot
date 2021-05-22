import React from 'react'
import { Jumbotron, Container, Button, Row, Col } from 'react-bootstrap';

export default function BootJumbo({ setWelcome, setLogin }) {
    const showForms = () => {
        setWelcome(false)
        setLogin(true)
    }

    return (
        <Jumbotron fluid>
            <Container>
                <Row border='dark'>
                    <Col lg={9} className='mr-auto ml-auto'>
                        <h1 className='text-center mb-4'>Welcome to Party Loot</h1>
                        <p className='text-center'>This app allows users to create shared inventories to manage loot and items for any roleplaying party.</p>
                        <p className='text-center'>Tap <strong>Get Started</strong> to set up a free account or <strong>Patreon</strong> if you'd like to support this free application.</p>

                        <h2 className='text-center mt-5 mb-4'>This is a Progressive Web Application</h2>
                        <p className='text-center mb-4'>With this page open in your mobile browser select <strong>add to home screen</strong> for the full experience.</p>
                    </Col>
                </Row>
                <Row className='justify-content-around mt-3'>
                    <a href='https://www.patreon.com/appsbynathan' className='w-50' target='blank'>
                        <Button className='w-100' variant='dark'>Patreon</Button>
                    </a>
                </Row>
                <Row className='justify-content-around mt-3'>
                    <Button className='w-50' variant='dark' onClick={showForms} >Get Started</Button>
                </Row>

            </Container>
        </Jumbotron>
    )
}
