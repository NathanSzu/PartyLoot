import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormLabel } from 'react-bootstrap';

export default function CategorySelect({ metadata, categories, setState }) {
  const [keys, setKeys] = useState([]);
  const [categoryArr, setCategoryArr] = useState([]);

  const getKeys = () => Object.keys(metadata);
  const handleCategoryCheck = (e, category) => {
    if (e.target.checked === true) {
      setCategoryArr([...categoryArr, category]);
    }
    if (e.target.checked === false) {
      setCategoryArr(categoryArr.filter((idx) => idx !== category));
    }
  };

  useEffect(() => {
    metadata && setKeys(getKeys());
  }, [metadata]);

  useEffect(() => {
    categories && setCategoryArr(categories);
  }, [categories]);

  useEffect(() => {
    setState(categoryArr);
    console.log(categoryArr);
  }, [categoryArr]);

  return (
    <Row className='p-2 border mx-0 mb-2'>
      <Col xs={12} className='text-center border-bottom mb-2'>
        <Form.Label>Choose at least 1 category</Form.Label>
      </Col>
      {keys &&
        keys.map((key) => (
          <Col key={key} xs={6}>
            <Form.Check
              defaultChecked={categoryArr.includes(key)}
              onChange={(e) => handleCategoryCheck(e, key)}
              value={key}
              label={metadata[key]}
            />
          </Col>
        ))}
    </Row>
  );
}
