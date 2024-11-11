import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { GroupContext } from '../../../../utils/contexts/GroupContext';
import NestedLootList from './NestedLootList';

export default function ContainerListItem({ container }) {
  const { returnContainerItems, sortedLoot } = useContext(GroupContext);

  const [containerLoot, setContainerLoot] = useState([]);

  useEffect(() => {
    setContainerLoot(returnContainerItems(container.id));
  }, [sortedLoot]);

  return (
    <>
      {containerLoot.length > 0 && (
        <div className='accordion-item background-dark rounded' key={container.id}>
          <h2 className='accordion-header' id='lootAccordionHeading'>
            <button
              className='background-dark rounded accordion-button accordion-button-loot-dark accordion-icon-hide collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target={`#collapse${container.id}`}
              aria-expanded='false'
              aria-controls={`collapse${container.id}`}
            >
              <Container>
                <Row className='justify-content-end'>
                  <Col className='ps-0'>
                    <h1 className='fancy-font fs-sm-deco text-light m-0 py-0'>{container.name}</h1>
                  </Col>
                </Row>
              </Container>
            </button>
          </h2>
          <div
            id={`collapse${container.id}`}
            className='accordion-collapse collapse'
            aria-labelledby='lootAccordionHeading'
            data-bs-parent='#loot-accordion'
          >
            <div className='accordion-body background-dark pt-0 rounded-bottom'>
              <Row>
                <Col className='text-light pb-3'>{container.description}</Col>
              </Row>
              <Row>
                <div className='accordion accordion-flush p-0' id='container-accordion'>
                  <NestedLootList lootArray={containerLoot} />
                </div>
              </Row>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
