import React, { useContext, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import { GlobalFeatures } from '../../../utils/contexts/GlobalFeatures';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import fb from 'firebase';

export default function CopyToGroupSection({ item }) {
  const { groupList, groups } = useContext(GroupContext);
  const { writeHistoryEvent, setToastHeader, setToastContent, toggleShowToast } = useContext(GlobalFeatures);
  const { currentUser } = useContext(AuthContext);

  const [ownerList, setOwnerList] = useState([]);
  const [group, setGroup] = useState('');
  const [owner, setOwner] = useState('');
  const [loading, setLoading] = useState(false);

  const itemOwnersRef = groups.doc(group || 'null').collection('itemOwners');
  const groupLootRef = groups.doc(group || 'null').collection('loot');

  const getItemOwners = () => {
    return itemOwnersRef
      .orderBy('name')
      .where('type', '==', 'party')
      .get()
      .then((querySnapshot) => {
        let results = [];
        querySnapshot.forEach((doc) => {
          results.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setOwnerList(results);
      });
  };

  const handleSaveToGroup = () => {
    let itemName = item.itemName || item.name;
    let itemDesc = item.itemDesc || item.desc;
    setLoading(true);
    groupLootRef
      .add({
        itemName,
        itemDesc,
        ownerId: owner,
        created: fb.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        let ownerName = owner === 'party' ? 'the party' : ownerList.find((selected) => selected.id === owner).name;

        setToastHeader('Item copied to group');
        setToastContent(`${itemName} has been successfully assigned to ${ownerName}`);
        toggleShowToast();

        let historyData = {
          itemName,
          owner: ownerName,
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

  useEffect(() => {
    group && getItemOwners();
    !group && setOwnerList([]);
  }, [group]);

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
          <select
            className='form-select'
            id='ownerSelect'
            aria-label='Select owner'
            disabled={!group || ownerList.length < 1}
            onChange={(e) => setOwner(e.target.value)}
            value={owner}
          >
            <option value=''>Select owner</option>
            <option value='party'>Party</option>
            {ownerList?.map((owner) => (
              <option value={owner.id} key={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
        </div>
        <div className='col-3 text-end'>
          <Button
            disabled={!owner}
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
