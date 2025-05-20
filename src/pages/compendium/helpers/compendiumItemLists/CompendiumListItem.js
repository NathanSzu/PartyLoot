import React, { useContext } from 'react';
import { ListGroupItem, Col, Row, Button, Stack } from 'react-bootstrap';
import { SingleLineLoading } from '../../../common/LoadingIndicators';
import { MemoizedModal } from './DetailsModal';
import { LikeDisplay } from './LikeDisplay';
import { AuthContext } from '../../../../utils/contexts/AuthContext';
import { DiscoveryFormWrapper } from '../recordingDiscoveries/DiscoveryFormWrapper';

export function LoadingListItem() {
  return (
    <ListGroupItem className='rounded border-dark'>
      <Row>
        <Col>
          <SingleLineLoading />
          <SingleLineLoading classProps='w-50 mt-1' />
        </Col>
        <Col xs={3} className='text-end'>
          <Button className='h-100 background-dark' variant='dark' disabled>
            View
          </Button>
        </Col>
      </Row>
    </ListGroupItem>
  );
}

export function NoResults() {
  return (
    <ListGroupItem className='rounded border-dark'>
      <Row>
        <Col>
          <h1 className='fancy-font fs-sm-deco m-0 text-center'>No results available</h1>
        </Col>
      </Row>
    </ListGroupItem>
  );
}

export function CompendiumListItem({
  itemId,
  itemName,
  itemDesc,
  item,
  editable = false,
  setQueryParams
}) {
  const { currentUser } = useContext(AuthContext);

  return (
    <ListGroupItem className='rounded border-dark' id={itemId}>
      <Row>
        <Col>
          <h1 className='fancy-font fs-sm-deco m-0'>{itemName}</h1>
          {item?.document__title && <em className='m-0'>{item.document__title}</em>}
          <LikeDisplay item={item} />
        </Col>
        
        {editable ? null : (
          <Col xs={2} className='px-2'>
          <Stack gap={1}> 
            <MemoizedModal
              item={item}
              itemId={itemId}
              itemName={itemName}
              itemDesc={itemDesc}
            />
            {item?.creatorId === currentUser?.uid && (
              <DiscoveryFormWrapper item={item} setQueryParams={setQueryParams} />
            )}
          </Stack>
          </Col>
        )}
      </Row>
    </ListGroupItem>
  );
}

export const MemoizedListItem = React.memo(CompendiumListItem);
