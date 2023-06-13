import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';

export default function Welcome({ setWelcome, setLogin }) {
	const showForms = () => {
		setWelcome(false);
		setLogin(true);
	};

	return (
			<Container fluid className="background-light rounded-bottom p-3" data-cy='welcome-message'>
				<Row className="p-3">
					<Col>
						<a href="https://www.patreon.com/dndnathan?fan_landing=true" target="blank">
							<Button variant='light' className="w-100 border-0">
								Patreon
							</Button>
						</a>
					</Col>
					<Col>
						<Button  variant='light' className="w-100 border-0" data-cy='get-started' onClick={showForms}>
							Get Started
						</Button>
					</Col>
				</Row>
				<Row border="dark">
					<Col xs={12} className="mr-auto ml-auto">
						<div className="p-3 fs-5">
							<h1 className="text-center mb-4 background-dark rounded text-light p-2">
								Welcome to Party Loot
							</h1>
							<p className="text-center">
								This app allows users to create shared inventories to manage loot and items for any
								roleplaying party.
							</p>
							<p className="text-center">
								Tap <strong>Get Started</strong> to set up an account or <strong>Patreon</strong> if
								you'd like to support this free application for others.
							</p>
						</div>
					</Col>
					<Col xs={12} className="mr-auto ml-auto">
						<div className="p-3  fs-5">
							<h2 className="text-center mb-4 background-dark rounded text-light p-2">
								This is a Progressive Web Application
							</h2>
							<p className="text-center mb-4">
								With this page open in your mobile browser select <strong>add to home screen</strong>{' '}
								for the full experience.
							</p>
						</div>
					</Col>
				</Row>
			</Container>
	);
}
