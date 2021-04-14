import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from './utils/AuthContext';
import Home from './pages/Home';
import Groups from './pages/Groups';
import Loot from './pages/Loot';
import BootNav from './components/BootNav';
import Container from 'react-bootstrap/Container';
import SecuredRoute from './utils/SecuredRoute';
import SkippedRoute from './utils/SkippedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <header>
          <Container>
            <BootNav />
          </Container>
        </header>
        <main>
          <Container>
            <SkippedRoute exact path='/' component={Home} />
            <SecuredRoute exact path='/groups' component={Groups} />
            <SecuredRoute exact path='/loot' component={Loot} />
          </Container>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
