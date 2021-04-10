import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import firebase from '../utils/firebase'

export default function BootNav() {
    const location = useLocation();

    const logOut = () => {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
    }

    return (
        <nav>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Party Loot</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="/" onClick={logOut}>Sign Out</Nav.Link>
                        {location.pathname === '/' || location.pathname === '/groups' ? null : <Nav.Link href="/groups">Groups</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </nav>
    )
}
