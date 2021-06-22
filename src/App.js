import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './utils/AuthContext';
import { GroupProvider } from './utils/GroupContext';
import Home from './pages/Home';
import Groups from './pages/Groups';
import Loot from './pages/Loot';
import Settings from './pages/Settings';
import PasswordReset from './pages/PasswordReset';
import BootNav from './components/BootNav';
import { Container, Row, Col } from 'react-bootstrap';
import SecuredRoute from './utils/SecuredRoute';
import SkippedRoute from './utils/SkippedRoute';
import GroupRoute from './utils/GroupRoute';

function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <Router>
          <header>
            <nav>
              <Container className='pr-0 pl-0'>
                <BootNav />
              </Container>
            </nav>
          </header>
          <main>
            <Container>
              <Row>
                {/* Constraining the max-width with Col md=8 */}
                <Col md={8} className='ml-auto mr-auto'>
                  <SkippedRoute exact path='/' component={Home} />
                  <SkippedRoute exact path='/forgot-password' component={PasswordReset} />
                  <SecuredRoute exact path='/groups' component={Groups} />
                  <SecuredRoute exact path='/user-settings' component={Settings} />
                  <GroupRoute exact path='/loot' component={Loot} />
                </Col>
              </Row>
            </Container>
          </main>
        </Router>
      </GroupProvider>
    </AuthProvider>
  );
}

export default App;
