// Packages
import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navigate, Routes, Route } from 'react-router-dom';

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
import SecuredRoutes from './utils/routingComponents/SecuredRoutes';
import GroupRoutes from './utils/routingComponents/GroupRoutes';
import SkippedRoutes from './utils/routingComponents/SkippedRoutes';

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
                  <Row>
                    <BootNav />
                  </Row>
                </Container>
              </nav>
            </header>
            <main>
              <Container>
                <Row>
                  <Routes>
                    <Route element={<SecuredRoutes />}>
                      <Route element={<Groups />} path='/groups' exact />
                      <Route element={<Settings />} path='/user-settings' exact />
                      <Route element={<Compendium />} path='/item-compendium' exact />
                    </Route>
                    <Route element={<SkippedRoutes />}>
                      <Route element={<Home />} path='/' exact />
                      <Route element={<PasswordReset />} path='/forgot-password' exact />
                    </Route>
                    <Route element={<GroupRoutes />}>
                      <Route element={<Loot />} path='/loot' exact />
                      <Route element={<History />} path='/history' exact />
                    </Route>
                    <Route path='*' element={<Navigate to='/groups' />} />
                  </Routes>
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
