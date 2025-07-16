import { useState, useContext } from 'react';
import { Modal, CloseButton } from 'react-bootstrap';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';

export default function IntroCard() {
  const { checkLocalStorage } = useContext(GlobalFeatures);

  const [dismiss, setDismiss] = useState(false);

  return (
    <div className={`mb-2 ${dismiss && 'd-none'}`}>
      <div className='modal show top-layer' style={{ display: 'block', position: 'initial' }}>
        <Modal.Dialog className='m-0'>
          <Modal.Header>
            <Modal.Title className='fancy-font fs-md-deco'>Creating items</Modal.Title>
            <CloseButton
              onClick={() => {
                checkLocalStorage('lootIntroCard', true);
                setDismiss(true);
              }}
            />
          </Modal.Header>

          <Modal.Body>
            <p>
              Here is where you can view, add, and edit items in your party inventory. You can also use the buttons
              above to add new party members or view a history of recent actions.
            </p>
            <p className='m-0'>
              Once you have a couple party members you can use the dropdown to filter items and currency by owner.
            </p>
          </Modal.Body>
        </Modal.Dialog>
      </div>
    </div>
  );
}
