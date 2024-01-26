import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ButtonShareLink from '../../common/ButtonShareLink';
import PatreonButton from '../../common/PatreonButton';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function PatchNotes() {
  const { db } = useContext(AuthContext);

  useEffect(() => {
    let unsubscribe;
    unsubscribe = getLatestPatchNote();

    return () => unsubscribe();
  }, []);

  const [show, setShow] = useState(false);

  const [patchNoteDoc, setPatchNoteDoc] = useState(false);

  const handleClose = () => setShow(false);

  const showNoteIfNew = (doc) => {
    let noteId = localStorage.getItem(doc.id);
    if (!noteId) {
      setPatchNoteDoc(doc);
      setShow(true);
    }
  };

  const getLatestPatchNote = () => {
    return db.collection('updateNotes')
      .orderBy('posted', 'desc')
      .limit(1)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          showNoteIfNew({ id: doc.id, ...doc.data() });
        });
      });
  };

  const markShowNote = (doc) => {
    localStorage.setItem(doc.id, 'dismissed');
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <h2 className='fs-md-deco mb-0'>{patchNoteDoc.title}</h2>
      </Modal.Header>

      <Modal.Body>
        <div>
          <p>{patchNoteDoc.description}</p>
          {patchNoteDoc.warning && (
            <p>
              <strong>{patchNoteDoc.warning}</strong>
            </p>
          )}
          {patchNoteDoc.bullets && (
            <ul>
              {patchNoteDoc.bullets.map((bullet, idx) => (
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
          <div className='pr-2'>Version: {patchNoteDoc.version}</div>
          <div>
            <small>
              <em>{patchNoteDoc.posted?.toDate().toString().substring(0, 16)}</em>
            </small>
          </div>
        </div>
        <Button
          variant='dark'
          className='background-dark'
          onClick={() => {
            markShowNote(patchNoteDoc);
          }}
        >
          <img alt='Mark as read' src='/APPIcons/check-lg.svg' />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
