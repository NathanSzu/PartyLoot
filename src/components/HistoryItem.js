import React, { useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';

export default function HistoryItem({ event }) {
  useEffect(() => {
    console.log(event);
  }, [event]);

  return (
    <ListGroup.Item>
      <p className='m-0'>{event.action}</p>
      <p className='m-0 pt-1 pb-1'>{event.summary}</p>
      <p className='m-0'>
        <em>{event.timestamp.toDate().toString().substring(0, 16)}</em>
      </p>
    </ListGroup.Item>
  );
}
