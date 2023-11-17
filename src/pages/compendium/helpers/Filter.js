import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

export function Filter({ metadata, setState, oglTabActive }) {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    metadata && setKeys(Object.keys(metadata));
  }, [metadata]);

  return (
    <Form>
      <Form.Label>Category</Form.Label>
      <Form.Control
        disabled={oglTabActive}
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

export function SettingFilter({ metadata, setState, oglTabActive }) {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    metadata && setKeys(Object.keys(metadata));
  }, [metadata]);

  return (
    <Form>
      <Form.Label>Campaign Setting</Form.Label>
      <Form.Control
        disabled={oglTabActive}
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

export function SearchFilter({ state, setState }) {

  return (
    <Form onSubmitCapture={(e) => e.preventDefault()}>
      <Form.Label>Search</Form.Label>
      <Form.Control
        as='input'
        placeholder='Start typing to begin search...'
        value={state}
        onChange={(e) => {
          e.target.value ? setState(e.target.value) : setState('');
        }}
      >
      </Form.Control>
    </Form>
  );
}
