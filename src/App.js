import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './pages/Home';
import Groups from './pages/Groups';
import Loot from './pages/Loot';
import BootNav from './components/BootNav';
import Container from 'react-bootstrap/Container';

import firebase from 'firebase/app'

function App() {
  return (
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
  );
}

export default App;
