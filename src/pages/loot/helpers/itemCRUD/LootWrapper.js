import React, { useContext } from 'react';
import { GroupContext } from '../../../../utils/contexts/GroupContext';
import ContainerListItem from '../containers/ContainerListItem';
import LootList from './LootList';

export default function LootWrapper() {
  const { returnContainerlessItems, partyStorageContainers } = useContext(GroupContext);

  return (
    <div className='accordion accordion-flush p-0' id='loot-accordion'>
      {partyStorageContainers.map((container) => (
        <ContainerListItem container={container} key={container.id}/>
      ))}
      <LootList lootArray={returnContainerlessItems()} />
    </div>
  );
}
