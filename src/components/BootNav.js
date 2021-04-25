import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import firebase from '../utils/firebase';
import { AuthContext } from '../utils/AuthContext';

export default function BootNav() {
    const location = useLocation();
    const { currentUser } = useContext(AuthContext)

    const logOut = () => {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
    }

    return (
            <Navbar bg="light" expand="false">
                <Navbar.Brand href="/">Party Loot</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {!currentUser ? null : <Nav.Link href="/" onClick={logOut}>Sign Out</Nav.Link>}
                        {location.pathname === '/' || location.pathname === '/groups' || location.pathname === '/forgot-password' ? null : <Nav.Link href="/groups">Groups</Nav.Link>}
                        {!currentUser ? null : <Nav.Link href="/user-settings">Settings</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
    )
}
