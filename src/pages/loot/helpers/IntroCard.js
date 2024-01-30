import React from 'react';
import { Col, Row, Container, Button, Badge } from 'react-bootstrap';
import QuillDisplay from '../../common/QuillDisplay';

export default function IntroCard() {
  return (
    <div className='accordion accordion-flush p-0' id='loot-accordion'>
      <div className='accordion-item rounded'>
        <h2 className='accordion-header' id='lootAccordionHeading'>
          <button
            className='rounded border-top border-dark accordion-button accordion-button-loot accordion-icon-hide collapsed'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#collapseIntroCard'
            aria-expanded='false'
            aria-controls='collapseIntroCard'
          >
            <Container>
              <Row className='justify-content-end'>
                <Col className='ps-0'>
                  <h1 className='fancy-font fs-sm-deco m-0 py-0'>The Adventure Begins!</h1>
                </Col>
              </Row>
            </Container>
          </button>
        </h2>
        <div
          id='collapseIntroCard'
          className='accordion-collapse collapse show'
          aria-labelledby='lootAccordionHeading'
          data-bs-parent='#loot-accordion'
        >
          <div className='accordion-body background-light rounded-bottom'>
            <Container>
              <Row className='pt-1 pb-1'>
                <Col className='d-flex align-items-center border-bottom border-dark px-0'>
                  <h2 className='fancy-font fs-sm-deco m-0'>Description</h2>
                </Col>
                <Col xs={2} className='text-right pe-0'>
                  <Button
                    disabled
                    data-cy='edit-item'
                    variant='dark'
                    className='p-2 m-0 background-dark border-0 w-100'
                  >
                    <img alt='Edit Item' src='APPIcons/pencil-square.svg' />
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col className='p-0'>
                  <QuillDisplay
                    className='p-0'
                    value='This is the field where you will see the description of items in your inventory. You can edit each item by tapping the button in the upper right, or you can create new items using the "Add Item" button above. Additionally, you can collapse or show item details by tapping the item names.'
                  />
                </Col>
              </Row>

              <Row className='border-bottom border-dark py-1'>
                <Col className='d-flex align-items-center px-0'>
                  <h2 className='fancy-font fs-sm-deco mb-1 mt-1'>Held By</h2>
                </Col>
              </Row>
              <Row>
                <Col className='ps-0'>
                  <Badge bg='dark' className='mt-3 p-2 px-3'>
                    This badge shows the owner
                  </Badge>
                </Col>
                <Col className='d-flex justify-content-end pe-0'>
                  <Button
                    data-cy='sell-item'
                    className='mt-3 me-2 p-0 px-3 btn-success background-success border-0'
                    disabled
                    type='button'
                  >
                    <img alt='Sell Item' src='APPIcons/coin.svg'></img>
                  </Button>
                  <Button
                    data-cy='delete-item'
                    className='mt-3 me-0 p-0 px-3 btn-danger background-danger border-0'
                    disabled
                    type='button'
                  >
                    <img alt='Sell Item' src='APPIcons/trash-fill.svg'></img>
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}
