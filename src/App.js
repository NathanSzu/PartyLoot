import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from './utils/AuthContext';
import Home from './pages/Home';
import Groups from './pages/Groups';
import Loot from './pages/Loot';
import BootNav from './components/BootNav';
import Container from 'react-bootstrap/Container';

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
            <Route exact path='/' component={Home} />
            <Route exact path='/groups' component={Groups} />
            <Route exact path='/loot' component={Loot} />
          </Container>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
