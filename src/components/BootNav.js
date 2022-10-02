import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import firebaseApp from '../utils/firebase';
import { AuthContext } from '../utils/contexts/AuthContext';
import { LinkContainer } from 'react-router-bootstrap';
import { GlobalFeatures } from '../utils/contexts/GlobalFeatures';

export default function BootNav() {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const { handleShowRequestModal } = useContext(GlobalFeatures);

  const logOut = () => {
    firebaseApp
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
    <Navbar bg='light' expand='false' collapseOnSelect>
      <LinkContainer to='/groups'>
        <Navbar.Brand className='fancy-font'>Party Loot</Navbar.Brand>
      </LinkContainer>
      {/* Hides the nav links if no user is logged in */}
      {!currentUser ? null : (
        <>
          <Navbar.Toggle aria-controls='basic-navbar-nav' data-cy='navbar-toggle' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ml-auto'>
              {/* <LinkContainer to='/item-compendium' data-cy='navbar-compendium'>
                <Nav.Link>Item Compendium</Nav.Link>
              </LinkContainer> */}
              {/* Hides the groups nav link if on the groups page */}
              {location.pathname === '/groups' ? null : (
                <LinkContainer to='/groups' data-cy='navbar-groups'>
                  <Nav.Link>Groups</Nav.Link>
                </LinkContainer>
              )}

              {['/history', '/groups', '/user-settings'].includes(location.pathname) ? null : (
                <LinkContainer to='/history' data-cy='navbar-history'>
                  <Nav.Link>History</Nav.Link>
                </LinkContainer>
              )}

              {['/groups', '/loot', '/user-settings'].includes(location.pathname) ? null : (
                <LinkContainer to='/loot' data-cy='navbar-loot'>
                  <Nav.Link>Loot</Nav.Link>
                </LinkContainer>
              )}

              {/* Hides the user setting nav link if on the user setting page */}
              {location.pathname === '/user-settings' ? null : (
                <LinkContainer to='/user-settings' data-cy='navbar-settings'>
                  <Nav.Link>Settings</Nav.Link>
                </LinkContainer>
              )}

              <Nav.Link href='/' onClick={logOut} data-cy='navbar-logout'>
                Sign Out
              </Nav.Link>
              {/* Hides the Request Feature / Report Bug link if on the user setting page */}
              {location.pathname === '/user-settings' ? null : (
                <LinkContainer to='/user-settings'>
                  <Nav.Link onClick={handleShowRequestModal}>Request Feature / Report Bug</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
}
