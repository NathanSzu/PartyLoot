import React, { useEffect, useContext, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function HistoryItem({ event }) {
  const { db } = useContext(AuthContext);
  
  const [displayName, setDisplayName] = useState('A shade');
  const [loading, setLoading] = useState(true);

  const maskDisplayName = async () => {
    try {
      const userRef = doc(db, 'users', event.completedBy);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        setDisplayName(docSnap.data().displayName);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error getting name:', error);
      setLoading(false);
    }
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
            <em>{event.timestamp}</em>
          </p>
        </>
      )}
    </ListGroup.Item>
  );
}
