import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import firebase from '../utils/firebase';
import { AuthContext } from '../utils/AuthContext';
import { LinkContainer } from 'react-router-bootstrap';

export default function BootNav() {
	const location = useLocation();
	const { currentUser } = useContext(AuthContext);

	const logOut = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
			})
			.catch((error) => {
				// An error happened.
			});
	};

	return (
		<Navbar bg="light" expand="false" collapseOnSelect>
			<LinkContainer to='/groups'>
				<Navbar.Brand className="fancy-font">
					Party Loot
				</Navbar.Brand>
			</LinkContainer>
			{location.pathname === '/' ? null : 
            <>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {currentUser.uid === ' ' ? null : (
                            <Nav.Link href="/" onClick={logOut}>Sign Out</Nav.Link>
                        )}
                        {location.pathname === '/' ||
                        location.pathname === '/groups' ||
                        location.pathname === '/forgot-password' ? null : (
							<LinkContainer to='/groups'>
                            	<Nav.Link>Groups</Nav.Link>
							</LinkContainer>
                        )}
                        {currentUser.uid === ' ' || location.pathname === '/user-settings' ? null : 
						<LinkContainer to='/user-settings'>
							<Nav.Link>Settings</Nav.Link>
						</LinkContainer>
						}
                    </Nav>
                </Navbar.Collapse>
            </>}
		</Navbar>
	);
}
