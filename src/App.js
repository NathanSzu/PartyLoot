// Packages
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Redirect, Switch } from 'react-router-dom';

// Providers
import { AuthProvider } from './utils/contexts/AuthContext';
import { GroupProvider } from './utils/contexts/GroupContext';
import { GlobalFeaturesProvider } from './utils/contexts/GlobalFeatures';

// Pages
import Home from './pages/home/Home';
import Groups from './pages/groups/Groups';
import Loot from './pages/loot/Loot';
import Settings from './pages/settings/Settings';
import History from './pages/history/History';
import Compendium from './pages/compendium/Compendium';
import PasswordReset from './pages/passwordReset/PasswordReset';

// DOM Components
import BootNav from './pages/common/BootNav';
import BootToast from './pages/common/BootToast';

// Routing Components
import SecuredRoute from './utils/routingComponents/SecuredRoute';
import SkippedRoute from './utils/routingComponents/SkippedRoute';
import GroupRoute from './utils/routingComponents/GroupRoute';

function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <GlobalFeaturesProvider>
          <BootToast />
          <Router>
            <header>
              <nav>
                <Container className='pr-0 pl-0'>
                  <Col md={10} className='ml-auto mr-auto p-0'>
                    <BootNav />
                  </Col>
                </Container>
              </nav>
            </header>
            <main>
              <Container>
                <Row>
                  <Col md={10} className='ml-auto mr-auto p-0'>
                    <Switch>
                      <SkippedRoute exact path='/' component={Home} />
                      <SkippedRoute exact path='/forgot-password' component={PasswordReset} />
                      <SecuredRoute exact path='/groups' component={Groups} />
                      <SecuredRoute exact path='/user-settings' component={Settings} />
                      {/* <SecuredRoute
                      exact
                      path="/compendium"
                      component={Compendium}
                    /> */}
                      <GroupRoute exact path='/loot' component={Loot} />
                      <GroupRoute exact path='/history' component={History} />
                      <Redirect from='*' to='/groups' />
                    </Switch>
                  </Col>
                </Row>
              </Container>
            </main>
          </Router>
        </GlobalFeaturesProvider>
      </GroupProvider>
    </AuthProvider>
  );
}

export default App;
