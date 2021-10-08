import React from 'react';
import { Jumbotron, Container, Button, Row, Col } from 'react-bootstrap';

export default function BootJumbo({ setWelcome, setLogin }) {
	const showForms = () => {
		setWelcome(false);
		setLogin(true);
	};

	return (
		<Jumbotron fluid className="background-unset rounded-bottom pt-3">
			<Container>
				<Row className="justify-content-around mb-3">
					<Col>
						<a href="https://www.patreon.com/dndnathan?fan_landing=true" target="blank">
							<Button variant='light' className="w-100 border-0">
								Patreon
							</Button>
						</a>
					</Col>
					<Col>
						<Button  variant='light' className="w-100 border-0" onClick={showForms}>
							Get Started
						</Button>
					</Col>
				</Row>
				<Row border="dark">
					<Col xs={12} lg={9} className="mr-auto ml-auto">
						<div className="add-background-light mt-3">
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
					<Col xs={12} lg={9} className="mr-auto ml-auto">
						<div className="add-background-light mt-3">
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
		</Jumbotron>
	);
}
