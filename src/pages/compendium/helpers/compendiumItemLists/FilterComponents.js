import { useContext, useEffect, useState } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { AuthContext } from '../../../../utils/contexts/AuthContext';
import { DiscoveryFormWrapper } from '../recordingDiscoveries/DiscoveryFormWrapper';
import { getFilterFields } from '../../../../controllers/metadataController';

export function FilterDropdown({ label, name, value, options, onChange }) {
  return (
    <Col xs={6} className='my-2 px-1'>
      <Form.Group className='container'>
        <Row>
          <Col xs={4} className='d-flex align-items-center background-dark rounded-start'>
            <Form.Label className='m-auto text-light'>{label}</Form.Label>
          </Col>
          <Col className='p-0'>
            <Form.Control
              as='select'
              className='rounded-start-0 border-0'
              name={name}
              value={value}
              onChange={onChange}
            >
              {options.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>
      </Form.Group>
    </Col>
  );
}

export function FilterComponent({ queryParams, onFilterChange, isCompendium, setQueryParams }) {
  const { currentUser } = useContext(AuthContext);
  const [filterFields, setFilterFields] = useState([]);

  useEffect(() => {
    const fetchFilterFields = async () => {
      try {
        const fields = await getFilterFields();
        setFilterFields(fields);
      } catch (error) {
        console.error('Error fetching filter fields:', error);
      }
    };
    fetchFilterFields();
  }, []);

  return (
    <>
      <div className='accordion' id='filterAccordion'>
        <div className='accordion-item rounded-0 background-light'>
          <h2 className='accordion-header' id='headingSearchFilter'>
            <button
              className='accordion-button collapsed accordion-button-loot rounded-0'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseSearchFilter'
              aria-expanded='false'
              aria-controls='collapseSearchFilter'
              data-cy='search-filter-button'
            >
              <img className='me-2' alt='Filter' src='/APPIcons/filter.svg'></img> Search and Filter
            </button>
          </h2>
          <div
            id='collapseSearchFilter'
            className='accordion-collapse collapse'
            aria-labelledby='headingSearchFilter'
            data-bs-parent='#filterAccordion'
          >
            <div className='accordion-body p-3 background-light'>
              <form>
                <Row>
                  <div className='col-12 px-1'>
                    <input
                      type='text'
                      name='search'
                      className='form-control border-0 text-center'
                      value={queryParams.search || ''}
                      onChange={(e) => onFilterChange(e)}
                      placeholder='Search by name or description'
                      data-cy='compendium-search'
                    />
                  </div>
                </Row>
                <Row>
                  {filterFields.map((field) => (
                    <FilterDropdown
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      value={queryParams[field.name]}
                      options={[
                        { label: 'All', value: '' },
                        ...field.options.map((option) => ({ label: option, value: option })),
                      ]}
                      onChange={onFilterChange}
                    />
                  ))}

                  <div className='col text-end px-1'>
                    {isCompendium && currentUser && (
                      <Button
                        variant='secondary'
                        className='me-2'
                        onClick={() => {
                          onFilterChange({ target: { name: 'creatorId', value: currentUser.uid } });
                        }}
                      >
                        Show my entries
                      </Button>
                    )}
                    <Button
                      variant='primary'
                      onClick={() => {
                        filterFields.forEach((field) => {
                          onFilterChange({ target: { name: field.name, value: '' } });
                        });
                        onFilterChange({ target: { name: 'search', value: '' } });
                        onFilterChange({ target: { name: 'creatorId', value: '' } });
                      }}
                    >
                      Reset filters
                    </Button>
                  </div>
                </Row>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isCompendium && (
        <Row className='background-white p-2'>
          <div className='col text-end'>
            <DiscoveryFormWrapper setQueryParams={setQueryParams} />
          </div>
        </Row>
      )}
    </>
  );
}
