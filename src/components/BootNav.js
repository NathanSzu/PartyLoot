import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

export default function BootNav() {
    const location = useLocation();

    return (
        <nav>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Party Loot</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        { location.pathname === '/' ? null : <Nav.Link href="/groups">Groups</Nav.Link> }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </nav>
    )
}
