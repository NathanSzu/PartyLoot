import React, { useState, useRef } from 'react';
import { Form, Button, Col, Row, Card, ListGroup, Spinner } from 'react-bootstrap';

export default function SearchOpen5E({ setSRDContent, setSearchSRD }) {
	const [ weapons, setWeapons ] = useState([]);
	const [ magicItems, setMagicItems ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const searchRef = useRef('');

	const searchApi = (query) => {
		if (!query) {
			return;
		}
		setLoading(true);
		fetch(`https://api.open5e.com/weapons/?search=${query}`)
			.then((response) => response.json())
			.then((weaponData) => {
				setWeapons(weaponData.results);
				fetch(`https://api.open5e.com/magicitems/?search=${query}`)
					.then((response) => response.json())
					.then((magicItemData) => {
						setMagicItems(magicItemData.results);
						setLoading(false);
					});
			})
	};

	const selectWeapon = async (e) => {
		const selection = weapons.filter((result) => {
			return result.slug === e.target.id;
		});
		setSRDContent({
			name: selection[0].name,
			desc: `${selection[0].category}
Damage: ${selection[0].damage_dice} ${selection[0].damage_type}
Properties: ${selection[0].properties.join(', ')}`,
			type: selection[0].damage_type
		});
		setSearchSRD(false);
	};

	const selectMagicItem = async (e) => {
		const selection = magicItems.filter((result) => {
			return result.slug === e.target.id;
		});
		setSRDContent({
			name: selection[0].name,
			desc: selection[0].desc,
			type: `${selection[0].type}${selection[0].requires_attunement && ','} ${selection[0].requires_attunement}`
		});
		setSearchSRD(false);
	};

	return (
		<Form>
			<Row>
				<Col className="ml-3">
					<Form.Group className="mb-3" controlId="formBasicEmail">
						<Form.Control type="input" ref={searchRef} placeholder="Search open source D&D items" />
					</Form.Group>
				</Col>
				<Col xs={2} className="pl-0 mr-3">
					<Button
						className="w-100"
						variant="dark"
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							searchApi(searchRef.current.value);
						}}
					>
						<img src='APPIcons/search.svg' alt="Search" />
					</Button>
				</Col>
			</Row>
			<Card className="mb-3">
				<ListGroup variant="flush">
					<ListGroup.Item className="text-center font-weight-bold" disabled>
						Weapons
					</ListGroup.Item>
					{!weapons.length > 0 && (
						<ListGroup.Item variant="secondary" className="text-center">
							No results found.
						</ListGroup.Item>
					)}
					{loading && (
						<Spinner
							as="div"
							className="d-flex mt-4 ml-auto mr-auto loading-spinner"
							animation="border"
							role="status"
							variant="dark"
						/>
					)}
					{!loading &&
						weapons.map((result, idx) => (
							<ListGroup.Item
								variant="secondary"
								onClick={selectWeapon}
								as={Button}
								key={idx}
								id={result.slug}
							>
								{result.name}
							</ListGroup.Item>
						))}
				</ListGroup>
				<ListGroup variant="flush">
					<ListGroup.Item className="text-center font-weight-bold" disabled>
						Magic Items
					</ListGroup.Item>
					{!magicItems.length > 0 && (
						<ListGroup.Item variant="secondary" className="text-center">
							No results found.
						</ListGroup.Item>
					)}
					{loading && (
						<Spinner
							as="div"
							className="d-flex mt-4 ml-auto mr-auto loading-spinner"
							animation="border"
							role="status"
							variant="dark"
						/>
					)}
					{!loading &&
						magicItems.map((result, idx) => (
							<ListGroup.Item
								variant="secondary"
								onClick={selectMagicItem}
								as={Button}
								key={idx}
								id={result.slug}
							>
								{result.name}
							</ListGroup.Item>
						))}
				</ListGroup>
			</Card>
		</Form>
	);
}
