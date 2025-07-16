import { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { GroupContext } from '../../../../utils/contexts/GroupContext';
import ContainerListItem from '../containers/ContainerListItem';
import LootList from './LootList';
import { Spinner } from 'react-bootstrap';

export default function LootWrapper() {
  const { returnContainerlessItems, partyStorageContainers, loadingContainers, loadingLoot } = useContext(GroupContext);

  return (
    <div className='accordion accordion-flush p-0' id='loot-accordion'>
      <Row>
        <Col xs={12} lg={6} className='px-1'>
          {loadingContainers ? (
            <div className='accordion-item background-dark rounded p-2'>
              <Spinner variant='white' />
            </div>
          ) : (
            partyStorageContainers.map((container) => <ContainerListItem container={container} key={container.id} />)
          )}
        </Col>
        <Col xs={12} lg={6} className='px-1'>
          {loadingLoot ? (
            <div className='accordion-item background-light rounded p-2'>
              <Spinner />
            </div>
          ) : (
            <LootList lootArray={returnContainerlessItems()} />
          )}
        </Col>
      </Row>
    </div>
  );
}
