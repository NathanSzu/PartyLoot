import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Row } from 'react-bootstrap';
import firebaseApp from '../../utils/firebase';
import { AuthContext } from '../../utils/contexts/AuthContext';

export default function BootNav() {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const navigate = useNavigate();

  const selectLink = (page = '') => {
    navigate(`/${page.toLowerCase()}`);
  };

  const logOut = () => {
    firebaseApp
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        navigate('/');
      })
      .catch((err) => {
        // An error happened.
        console.error(err);
      });
  };

  const pages = ['Groups', 'Compendium', 'Settings'];

  useEffect(() => {
    setExpanded(false);
  }, [location])
  

  return (
    <Row>
      <Navbar className='p-2' bg='light' expand='false' expanded={expanded}>
        <Navbar.Brand
          as='button'
          className='fancy-font ps-2 py-0 fs-lg-deco border-0 background-unset'
          onClick={() => selectLink()}
          data-cy='navbar-brand'
        >
          Party Loot
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' data-cy='navbar-toggle' onClick={toggleExpanded} />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ps-2'>
            {currentUser ? (
              <>
                {pages.map((page, idx) => (
                  <Nav.Link
                    key={idx}
                    onClick={() => selectLink(page)}
                    data-cy={`navbar-${page.toLowerCase()}`}
                    className='border-bottom'
                  >
                    {page}
                  </Nav.Link>
                ))}

                <Nav.Link onClick={logOut} data-cy='navbar-logout'>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={() => selectLink('login')} data-cy='navbar-login'>
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Row>
  );
}
