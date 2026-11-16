import { useState, useEffect } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { MemoizedListItem, LoadingListItem, NoResults } from './CompendiumListItem';
import Pagination from './Pagination';
import { FilterComponent } from './FilterComponents';

export function CompendiumList({ searchItems, isCompendium }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queryParams, setQueryParams] = useState({ type: '', rarity: '', search: '' });

  const getItems = async (queryParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchItems(queryParams);
      setData(data);
    } catch (error) {
      console.error('Error retrieving compendium items:', error);
      setError('Unable to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems(queryParams);
  }, [queryParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setQueryParams((prev) => {
      const { nextPage, prevPage, ...rest } = prev; // Remove the page keys from the state
      return { ...rest, [name]: value };
    });
  };

  const onPageChange = (name, value) => {
    setQueryParams((prev) => {
      const { nextPage, prevPage, ...rest } = prev; // Remove the page keys from the state
      return { ...rest, [name]: value };
    });
  };

  const handleResetQueryParamsOnSubmit = () => {
    setQueryParams({...queryParams, type: '', rarity: '', search: '' })
  }

  return (
    <>
      <FilterComponent queryParams={queryParams} onFilterChange={handleFilterChange} isCompendium={isCompendium} setQueryParams={handleResetQueryParamsOnSubmit} />
      <ListGroup className='p-2'>
        {loading ? (
          <>
            <LoadingListItem />
            <LoadingListItem />
            <LoadingListItem />
          </>
        ) : error ? (
          <ListGroup.Item role='alert' data-cy='compendium-load-error' className='d-flex justify-content-between align-items-center'>
            {error}
            <Button variant='outline-dark' size='sm' onClick={() => getItems(queryParams)}>
              Retry
            </Button>
          </ListGroup.Item>
        ) : (
          <>
            {data?.results?.map((item) => (
            <MemoizedListItem
              key={item.slug || item.id || item.key}
              itemId={item.slug || item.id || item.key}
              itemName={item.name || item.itemName}
              itemDesc={item.desc || item.itemDesc}
              item={item}
              setQueryParams={handleResetQueryParamsOnSubmit}
            />
            ))}
            <Pagination nextPage={data?.next} prevPage={data?.previous} onPageChange={onPageChange} />
          </>
        )}
        {data?.results?.length === 0 && !loading && !error && <NoResults />}
      </ListGroup>
    </>
  );
}
