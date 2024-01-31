// Packages
import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navigate, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './utils/contexts/AuthContext';
import { GroupProvider } from './utils/contexts/GroupContext';
import { GlobalFeaturesProvider } from './utils/contexts/GlobalFeatures';

// Pages
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Groups from './pages/groups/Groups';
import Loot from './pages/loot/Loot';
import Settings from './pages/settings/Settings';
import History from './pages/history/History';
import Compendium from './pages/compendium/Compendium';
import PasswordReset from './pages/passwordReset/PasswordReset';

// DOM Components
import BootNav from './pages/common/BootNav';
import BootToast from './pages/common/BootToast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GroupProvider>
          <GlobalFeaturesProvider>
            <BootToast />
            <Container className='scroll-container'>
              <BootNav />
              <Routes>
                <Route>
                  <Route element={<Groups />} path='/groups' exact />
                  <Route element={<Settings />} path='/settings' exact />
                  <Route element={<Compendium />} path='/compendium' exact />
                  <Route element={<Login />} path='/login' exact />
                  <Route element={<PasswordReset />} path='/forgot-password' exact />
                  <Route element={<Home />} path='/' exact />
                  <Route element={<Loot />} path='/loot' exact />
                  <Route element={<History />} path='/history' exact />
                  <Route path='*' element={<Navigate to='/' />} />
                </Route>
              </Routes>
            </Container>
          </GlobalFeaturesProvider>
        </GroupProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
