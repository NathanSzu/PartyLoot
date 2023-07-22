import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

export function Filter({ metadata, setState }) {
  const [keys, setKeys] = useState([]);

  const getKeys = () => Object.keys(metadata);

  useEffect(() => {
    metadata && setKeys(getKeys());
  }, [metadata]);

  useEffect(() => {
    keys && console.log(keys)
  }, [keys])
  

  return (
    <Form>
      <Form.Label>Category</Form.Label>
      <Form.Control
        as='select'
        onChange={(e) => {
          e.target.value ? setState([e.target.value]) : setState(keys);
        }}
      >
        <option value={''}>All</option>
        {keys &&
          keys.map((key) => (
            <option key={key} value={key}>
              {metadata[key]}
            </option>
          ))}
      </Form.Control>
    </Form>
  );
}


export function SettingFilter({ metadata, setState }) {
  const [keys, setKeys] = useState([]);

  const getKeys = () => Object.keys(metadata);

  useEffect(() => {
    metadata && setKeys(getKeys());
    console.log(keys);
    console.log(metadata);
  }, [metadata]);

  useEffect(() => {
    keys && console.log(keys)
  }, [keys])
  

  return (
    <Form>
      <Form.Label>Campaign Setting</Form.Label>
      <Form.Control
        as='select'
        onChange={(e) => {
          e.target.value ? setState(e.target.value) : setState(null);
        }}
      >
        <option value={''}>All</option>
        {keys &&
          keys.map((key) => (
            <option key={key} value={key}>
              {metadata[key].setting}
            </option>
          ))}
      </Form.Control>
    </Form>
  );
}
