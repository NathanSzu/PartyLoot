import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ButtonShareLink from '../../common/ButtonShareLink';
import PatreonButton from '../../common/PatreonButton';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function PatchNotes() {
  const { currentUser, db } = useContext(AuthContext);

  useEffect(() => {
    getPatchNotes();
  }, []);

  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [docId, setDocId] = useState('');

  const handleClose = () => setShow(false);

  const showNoteIfNew = (doc) => {
    db.collection('updateNotes')
      .doc(doc.id)
      .collection('confirmedBy')
      .where('id', '==', currentUser.uid)
      .get()
      .then((confirmSnap) => {
        if (confirmSnap.docs.length === 0) setShow(true);
      })
      .catch((error) => {
        console.error('Error getting confirmations: ', error);
      });
  };

  const getPatchNotes = () => {
    db.collection('updateNotes')
      .orderBy('posted', 'desc')
      .limit(1)
      .get()
      .then((noteSnap) => {
        noteSnap.forEach((doc) => {
          setData(doc.data());
          setDocId(doc.id);
          showNoteIfNew(doc);
        });
      })
      .catch((error) => {
        console.error('Error getting patch notes: ', error);
      });
  };

  const markNoteAsRead = (uid, docId) => {
    db.collection('updateNotes')
      .doc(docId)
      .collection('confirmedBy')
      .add({
        id: uid,
      })
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        console.error('Error marking note as read: ', error);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <h2 className='groups-h2 mb-0'>{data.title}</h2>
      </Modal.Header>

      <Modal.Body>
        <div>
          <p>{data.description}</p>
          {data.warning && <p><strong>{data.warning}</strong></p>}
          {data.bullets && (
            <ul>
              {data.bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className='mb-1 text-center border-top pt-2 pb-2'>Want to show your support?</p>
          <ButtonShareLink />
          <PatreonButton />
        </div>
      </Modal.Body>

      <Modal.Footer className='space-between'>
        <div className='d-flex'>
          <div className='pr-2'>Version: {data.version}</div>
          <div>
            <small>
              <em>{data.posted?.toDate().toString().substring(0, 16)}</em>
            </small>
          </div>
        </div>
        <Button
          variant='dark'
          className='background-dark'
          onClick={() => {
            markNoteAsRead(currentUser.uid, docId);
          }}
        >
          <img alt='Mark as read' src='/APPIcons/check-lg.svg' />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
