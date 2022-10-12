import React, { useEffect, useContext, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { AuthContext } from '../utils/contexts/AuthContext';

export default function HistoryItem({ event }) {
  const { db } = useContext(AuthContext);
  const userRef = db.collection('users').doc(event.completedBy);

  const [displayName, setDisplayName] = useState('A shade');
  const [loading, setLoading] = useState(true);

  const maskDisplayName = () => {
    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setDisplayName(doc.data().displayName);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error getting name:', error);
      });
  };

  useEffect(() => {
    maskDisplayName();
  }, [event]);

  return (
    <ListGroup.Item>
      {loading && (
        <Spinner
          as='div'
          className='d-flex ml-auto mr-auto loading-spinner-small'
          animation='border'
          role='status'
          variant='dark'
        />
      )}
      {!loading && (
        <>
          <p className='m-0 pt-1 pb-1'>{displayName} {event.summary}</p>
          <p className='m-0'>
            <em>{event.timestamp.toDate().toString().substring(0, 16)}</em>
          </p>
        </>
      )}
    </ListGroup.Item>
  );
}
