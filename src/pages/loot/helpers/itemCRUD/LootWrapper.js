import React, { useContext } from 'react';
import { GroupContext } from '../../../../utils/contexts/GroupContext';
import ContainerListItem from '../containers/ContainerListItem';
import LootList from './LootList';
import { Spinner } from 'react-bootstrap';

export default function LootWrapper() {
  const { returnContainerlessItems, partyStorageContainers, loadingContainers, loadingLoot } = useContext(GroupContext);

  return (
    <div className='accordion accordion-flush p-0' id='loot-accordion'>
      {loadingContainers ? (
        <div className='accordion-item background-dark rounded p-2'><Spinner variant='white'/></div>
      ) : (
        partyStorageContainers.map((container) => <ContainerListItem container={container} key={container.id} />)
      )}
      {loadingLoot ? <div className='accordion-item background-light rounded p-2'><Spinner /></div> : <LootList lootArray={returnContainerlessItems()} />}
    </div>
  );
}