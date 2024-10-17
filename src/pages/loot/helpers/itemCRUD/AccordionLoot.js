import React, { useContext } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import ModalLoot from './ModalLoot';
import HeldBySection from './HeldBySection';
import QuillDisplay from '../../../common/QuillDisplay';
import { GroupContext } from '../../../../utils/contexts/GroupContext';

export default function AccordionLoot() {
  const { sortedLoot } = useContext(GroupContext);

  return (
    <div className='accordion accordion-flush p-0' id='loot-accordion'>
      {sortedLoot.sorted.map((item) => (
        <div className='accordion-item rounded' key={item.id}>
          <h2 className='accordion-header' id='lootAccordionHeading'>
            <button
              className='rounded border-top border-dark accordion-button accordion-button-loot accordion-icon-hide collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target={`#collapse${item.id}`}
              aria-expanded='false'
              aria-controls={`collapse${item.id}`}
            >
              <Container>
                <Row className='justify-content-end'>
                  <Col className='ps-0'>
                    <h1 className='fancy-font fs-sm-deco m-0 py-0'>{item.itemName}</h1>
                  </Col>
                  {item?.itemQty > 0 && (
                    <Col xs={2} className='p-0'>
                      <p className='vertical-center text-position-end'>x{item?.itemQty || 1}</p>
                    </Col>
                  )}
                </Row>
              </Container>
            </button>
          </h2>
          <div
            id={`collapse${item.id}`}
            className='accordion-collapse collapse'
            aria-labelledby='lootAccordionHeading'
            data-bs-parent='#loot-accordion'
          >
            <div className='accordion-body background-light rounded-bottom'>
              <Container>
                <Row className='pt-1 pb-1'>
                  <Col className='d-flex align-items-center border-bottom border-dark px-0'>
                    <h2 className='fancy-font fs-sm-deco m-0'>Description</h2>
                  </Col>
                  {item.currCharges && item.maxCharges && (
                    <Col className='d-flex align-items-center border-bottom border-dark pl-0'>
                      <h2 className='fancy-font fs-sm-deco mb-1 mt-1'>
                        {item.currCharges} / {item.maxCharges} <img alt='Charges' src='APPIcons/charge.svg' />
                      </h2>
                    </Col>
                  )}
                  <Col xs={2} className='text-right pe-0'>
                    <ModalLoot item={item} idx={item.id} />
                  </Col>
                </Row>

                <Row>
                  <Col className='p-0'>
                    <QuillDisplay className='p-0' value={item?.itemDesc} />
                  </Col>
                </Row>

                <HeldBySection item={item} />
              </Container>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
