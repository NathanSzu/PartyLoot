import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

export default function BootNav() {
    return (
        <nav>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">Party Loot</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/groups">Groups</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </nav>
    )
}
