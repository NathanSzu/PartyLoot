import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import ItemOwnerSelect from '../../common/ItemOwnerSelect';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import fb from 'firebase';

export default function CopyToGroupSection({ item }) {
  const { groupList, groups } = useContext(GroupContext);
  const { writeHistoryEvent, setToastHeader, setToastContent, setShowToast } = useContext(GlobalFeatures);
  const { currentUser } = useContext(AuthContext);

  const [group, setGroup] = useState('');
  const [owner, setOwner] = useState('');
  const [loading, setLoading] = useState(false);

  const groupLootRef = groups.doc(group || 'null').collection('loot');

  const handleSaveToGroup = () => {
    let itemName = item.itemName || item.name;
    let itemDesc = item.itemDesc || item.desc || '';
    setLoading(true);
    groupLootRef
      .add({
        itemName,
        itemQty: 1,
        itemDesc,
        ownerId: owner || 'party',
        created: fb.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setToastHeader('Item copied to group');
        setToastContent(`${itemName} has been saved to your group`);
        setShowToast(true);

        let historyData = {
          itemName,
        };
        writeHistoryEvent(currentUser.uid, 'addFromCompendium', historyData, group)
          .then(() => {
            setGroup('');
            setOwner('');
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error adding history event: ', error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error adding item to group: ', error);
        setLoading(false);
      });
  };

  const handleSelectGroup = (value) => {
    setOwner('');
    setGroup(value);
  };

  return (
    <form className='position-relative container border-top pt-3' onSubmitCapture={(e) => e.preventDefault()}>
      <div className={loading ? 'overlay-loader' : ''}></div>
      <h2 className='fs-sm-deco'>Add to a group?</h2>
      <div className='mb-3 col-12'>
        <label htmlFor='groupSelect' className='form-label'>
          Group
        </label>
        <select
          className='form-select'
          id='groupSelect'
          aria-label='Select group'
          onChange={(e) => handleSelectGroup(e.target.value)}
          value={group}
        >
          <option value=''>Select group</option>
          {groupList?.map((group) => (
            <option value={group.id} key={group.id}>
              {group.groupName}
            </option>
          ))}
        </select>
      </div>
      <label htmlFor='ownerSelect' className='form-label'>
        Owner
      </label>
      <div className='row'>
        <div className='mb-3 col-9'>
          <ItemOwnerSelect setState={setOwner} state={owner} group={group} disabled={!group} />
        </div>
        <div className='col-3 text-end'>
          <Button
            disabled={!group}
            variant='dark'
            type='submit'
            className='btn btn-primary background-dark'
            onClick={handleSaveToGroup}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
