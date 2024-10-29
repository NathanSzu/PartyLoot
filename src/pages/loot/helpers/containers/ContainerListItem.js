import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function ContainerListItem({ container }) {
  return (
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
        <div className='accordion-body background-light rounded-bottom'>
          <Container>
            <Row>{container.description}</Row>
          </Container>
        </div>
      </div>
    </div>
  );
}
