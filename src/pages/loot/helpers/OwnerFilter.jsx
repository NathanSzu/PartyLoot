import { useContext } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { GroupContext } from '../../../utils/contexts/GroupContext';
import ModalParty from './ModalParty';
import ItemOwnerSelect from '../../common/ItemOwnerSelect';

export default function OwnerFilter() {
  const { setItemQuery, itemQuery, currentGroup } = useContext(GroupContext);

  // required because the ItemOwnerSelect is used in multiple places
  const setOneParam = (param) => {
    setItemQuery({
      ...itemQuery,
      itemOwner: param
    })
  }

  return (
    <Row className='mt-2'>
      <Col xs={9} className='pe-0'>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <ItemOwnerSelect setState={setOneParam} group={currentGroup} state={itemQuery.itemOwner} />
        </Form>
      </Col>

      <Col xs={3}>
        <ModalParty />
      </Col>
    </Row>
  );
}
