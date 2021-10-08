import React, { useState } from 'react';
import Jumbotron from '../components/JumbotronWelcome';
import Login from '../components/BootLogin';
import { Row, Col } from 'react-bootstrap';

export default function Home() {
	const [ login, setLogin ] = useState(null);
	const [ welcome, setWelcome ] = useState(true);

	return (
		<div className="p-0">
			{welcome ? <Jumbotron setLogin={setLogin} setWelcome={setWelcome} /> : null}
			<Row className="justify-content-md-center pl-3 pr-3">
				<Col>{!welcome ? <Login login={login} setLogin={setLogin} /> : null}</Col>
			</Row>
		</div>
	);
}
