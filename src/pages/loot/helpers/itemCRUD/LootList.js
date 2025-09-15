import { Col, Row, Container } from 'react-bootstrap';
import CreateLootItem from './CreateLootItem';
import HeldBySection from './HeldBySection';
import QuillDisplay from '../../../common/QuillDisplay';
import RarityBadge from './RarityBadge';
import ItemTagDisplay from './ItemTagDisplay';

export default function LootList({ lootArray, isNested = false }) {
  const getCollapseId = (itemId) => isNested ? `nestedCollapse${itemId}` : `collapse${itemId}`;
  const getAccordionBodyClass = () => isNested 
    ? 'accordion-body border-bottom border-start border-end border-white background-light rounded-bottom'
    : 'accordion-body background-light rounded-bottom';

  return (
    <>
      {lootArray.map((item) => (
        <div className='accordion-item rounded' key={item.id}>
          <h2 className='accordion-header' id={`heading${item.id}`}>
            <button
              className='rounded accordion-button accordion-button-loot accordion-icon-hide collapsed'
              data-bs-toggle='collapse'
              data-bs-target={`#${getCollapseId(item.id)}`}
              aria-expanded='false'
              aria-controls={getCollapseId(item.id)}
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
            id={getCollapseId(item.id)}
            className='accordion-collapse collapse'
            aria-labelledby={`heading${item.id}`}
          >
            <div className={getAccordionBodyClass()}>
              <Container>
                <Row className='pt-1 pb-1'>
                  <Col className='d-flex align-items-center justify-content-between border-bottom border-dark px-0'>
                    <h2 className='fancy-font fs-sm-deco m-0'>Description</h2>
                  </Col>
                  {item.currCharges && item.maxCharges && (
                    <Col className='d-flex align-items-center border-bottom border-dark pl-0'>
                      <h2 className='fancy-font fs-sm-deco mb-1 mt-1 ms-auto'>
                        {item.currCharges} / {item.maxCharges} <img alt='Charges' src='APPIcons/charge.svg' />
                      </h2>
                    </Col>
                  )}
                  <Col xs={2} className='text-right pe-0'>
                    <CreateLootItem item={item} idx={item.id} />
                  </Col>
                </Row>

                <Row>
                  <Col className='p-0'>
                    <RarityBadge itemRarity={item?.rarity} />
                    <QuillDisplay className='p-0' value={item?.itemDesc} />
                  </Col>
                </Row>
                <Row>
                  <Col className='p-0'>
                    <ItemTagDisplay itemTags={item?.itemTags} />
                  </Col>
                </Row>

                <HeldBySection item={item} />
              </Container>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
