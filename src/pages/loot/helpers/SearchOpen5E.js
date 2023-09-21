import React, { useState, useRef } from 'react';
import { Form, Button, Col, Row, Card, ListGroup, Spinner } from 'react-bootstrap';

export default function SearchOpen5E({ setSRDContent, setSearchSRD }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef('');

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
      const response = await fetch('https://itemsearch-7kp4kvdcxq-uc.a.run.app?search', {
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
      desc: formatDescription(selection),
    });
    setSearchSRD(false);
  };

  const formatDescription = (selection) => {
    if (selection?.itemDesc) return selection.itemDesc;
    if (selection?.desc) {
      let modifiedStr = selection.desc
        .replace('**_Curse_**. ', '</p><br><p><strong>Cursed: </strong>')
        .replace('_remove curse_', '<u>remove curse</u>');

      return `<p><em>${selection.type} ${selection.requires_attunement}</em></p><br><p>${modifiedStr}</p>`;
    }
    if (selection?.ac_string) {
      return `<p><em>${selection.category}</em></p><br><p><strong>AC:</strong> ${selection.ac_string}</p>`;
    }
    if (selection?.damage_type) {
      let properties = selection.properties.length > 0 ? selection.properties.join(', ') : '';
      return `<p><em>${selection.category}</em></p><p><em>${properties}</em></p><br><p>${selection.damage_dice} ${selection.damage_type} damage</p>`;
    }
  };

  const formatSource = (source) => {
    let modifiedSrc = source.replace('Systems Reference Document', 'D&D SRD').replace('OGL', '');

    return modifiedSrc;
  };

  return (
    <Form className='my-3'>
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
          {items.length < 1 && (
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
