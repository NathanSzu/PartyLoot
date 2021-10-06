import React, { useState, useRef } from 'react';
import { Form, Button, Col, Row, Card, ListGroup } from 'react-bootstrap';
import search from '../assets/search.svg';

export default function SearchOpen5E({ setSRDContent, setSearchSRD }) {
    const [ results, setResults ] = useState([]);
	const searchRef = useRef('');

	const searchApi = (query) => {
		if (!query) {
			return;
		}
		fetch(`https://api.open5e.com/magicitems/?search=${query}`)
			.then((response) => response.json())
			.then((data) => {
                setResults(data.results)
            });
	};

    const selectItem = async (e) => {
        const selection = results.filter((result) => {
            return result.slug === e.target.id
        });
        setSRDContent({
            name: selection[0].name,
            desc: selection[0].desc,
            type: selection[0].type
        });
        setSearchSRD(false);
    }

	return (
		<Form>
			<Row>
				<Col className='ml-3'>
					<Form.Group className="mb-3" controlId="formBasicEmail">
						<Form.Control type="input" ref={searchRef} placeholder="Search open source D&D items" />
					</Form.Group>
				</Col>
				<Col xs={2} className="pl-0 mr-3">
					<Button
                        className='w-100'
						variant="dark"
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							searchApi(searchRef.current.value);
						}}
					>
						<img src={search} />
					</Button>
				</Col>
			</Row>
			<Card className='mb-3'>
				<ListGroup variant="flush">
                    {results.map((result, idx) => (<ListGroup.Item variant='light' onClick={selectItem} as={Button} key={idx} id={result.slug}>{result.name}</ListGroup.Item>))}
				</ListGroup>
			</Card>
		</Form>
	);
}
