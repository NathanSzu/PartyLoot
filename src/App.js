import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './utils/contexts/AuthContext';
import { GroupProvider } from './utils/contexts/GroupContext';
import { GlobalFeaturesProvider } from './utils/contexts/GlobalFeatures';
import Home from './pages/Home';
import Groups from './pages/Groups';
import Loot from './pages/Loot';
import Settings from './pages/Settings';
import PasswordReset from './pages/PasswordReset';
import BootNav from './components/BootNav';
import ModalAppRequest from './components/ModalAppRequest';
import { Container, Row, Col } from 'react-bootstrap';
import SecuredRoute from './utils/routingComponents/SecuredRoute';
import SkippedRoute from './utils/routingComponents/SkippedRoute';
import GroupRoute from './utils/routingComponents/GroupRoute';
import BootToast from './components/BootToast';

function App() {
	useEffect(() => {
		console.log(process.env.REACT_APP_ENVIRONMENT);
	});

	return (
		<AuthProvider>
			<GroupProvider>
				<GlobalFeaturesProvider>
					<ModalAppRequest />
					<BootToast />
					<Router>
						<header>
							<nav>
								<Container className="pr-0 pl-0">
									<Col md={8} className="ml-auto mr-auto p-0">
										<BootNav />
									</Col>
								</Container>
							</nav>
						</header>
						<main>
							<Container>
								<Row>
									{/* Constraining the max-width with Col md=8 */}
									<Col md={8} className="ml-auto mr-auto p-0">
										<SkippedRoute exact path="/" component={Home} />
										<SkippedRoute exact path="/forgot-password" component={PasswordReset} />
										<SecuredRoute exact path="/groups" component={Groups} />
										<SecuredRoute exact path="/user-settings" component={Settings} />
										<GroupRoute exact path="/loot" component={Loot} />
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
