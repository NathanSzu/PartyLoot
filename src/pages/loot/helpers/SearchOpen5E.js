import React, { useState, useRef, useContext } from 'react';
import { Form, Button, Col, Row, Card, ListGroup, Spinner } from 'react-bootstrap';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';

export default function SearchOpen5E({ setSRDContent, setSearchSRD }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef('');
  const { formatItemDescription } = useContext(GlobalFeatures);

  let timer;

  function delay(fn) {
    clearTimeout(timer);
    timer = setTimeout(fn, 1000);
  }

  const searchApi = (query) => {
    if (query.trim().length < 3) {
      clearTimeout(timer);
      return;
    }

    async function search(query) {
      setLoading(true);
      const response = await fetch(process.env.REACT_APP_ITEM_SEARCH_URL, {
        method: 'POST',
        body: query.toLowerCase(),
      });
      const resJson = await response.json();
      setLoading(false);
      setItems(resJson);
    }

    delay(() => search(query));
  };

  const selectItem = (selection) => {
    setSRDContent({
      name: selection.name,
      desc: formatItemDescription(selection),
    });
    setSearchSRD(false);
  };

  const formatSource = (source) => {
    let modifiedSrc = source.replace('Systems Reference Document', 'D&D SRD').replace('OGL', '');

    return modifiedSrc;
  };

  return (
    <Form className='my-3' onSubmitCapture={(e) => e.preventDefault()}>
      <Row className='px-3'>
        <Col>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Control
              type='input'
              onChange={() => searchApi(searchRef.current?.value)}
              ref={searchRef}
              placeholder='Search open source D&D items'
            />
          </Form.Group>
        </Col>
      </Row>
      <Card className='mx-3 p-3'>
        <ListGroup variant='border-0 flush'>
          <ListGroup.Item className='text-center font-weight-bold' disabled>
            <Row>
              <Col className='text-start'>Result</Col>
              <Col className='text-end'>Source</Col>
            </Row>
          </ListGroup.Item>
          {items.length < 1 && !loading && (
            <ListGroup.Item variant='secondary' className='text-center'>
              No results found...
            </ListGroup.Item>
          )}
          {loading && (
            <Spinner
              as='div'
              className='d-flex mt-4 ml-auto mr-auto loading-spinner'
              animation='border'
              role='status'
              variant='dark'
            />
          )}
          {!loading &&
            items.map((result, idx) => (
              <ListGroup.Item
                variant='secondary'
                onClick={() => selectItem(result)}
                as={Button}
                key={idx}
                id={result.slug || result.id}
              >
                <Row>
                  <Col className='text-start'>{result.name}</Col>
                  <Col xs={5} className='text-end ps-0'>
                    <span className='badge rounded-pill bg-white text-dark'>
                      {formatSource(result?.document__title)}
                    </span>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card>
    </Form>
  );
}
