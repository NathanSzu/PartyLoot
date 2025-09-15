import { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { GlobalFeatures } from '../../../../utils/contexts/GlobalFeatures';
import { GroupContext } from '../../../../utils/contexts/GroupContext';

export default function ValueDisplay() {
  const { defaultColors, currencyKeys } = useContext(GlobalFeatures);
  const { allTags, sortedLoot } = useContext(GroupContext);

  const [itemTotals, setItemTotals] = useState({});
  const [loadingTotals, setLoadingTotals] = useState(true);

  const sumItemObjects = (...objs) => {
    return objs.reduce((a, b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
      }
      return a;
    }, {});
  };

  const sumItems = (items) => {
    let values = { currency1: 0, currency2: 0, currency3: 0, currency4: 0, currency5: 0, currency6: 0 };
    const itemsWithValues = items.filter((item) => item.value);

    itemsWithValues.forEach((item) => {
      let itemValues = {};
      Object.keys(item.value).forEach((key) => {
        itemValues[key] = item.value[key] * (item?.itemQty || 1);
      });
      values = sumItemObjects(values, itemValues);
    });
    setItemTotals(values);
    setLoadingTotals(false);
  };

  useEffect(() => {
    sumItems(sortedLoot);
  }, [sortedLoot]);

  return (
    <Row className='px-1 pt-2'>
      <Col xs={12} className='pb-2 px-4'><div className='border-bottom border-secondary'>Total item values</div></Col>
      <Col>
        {!loadingTotals && (
          <Row className='px-3'>
            {currencyKeys.map((currencyKey, idx) => (
              <Col key={currencyKey} xs={2} className='px-1'>
                <div
                  className='small rounded text-center'
                  style={{
                    height: 21,
                    backgroundColor: allTags?.[currencyKey]?.color || defaultColors[idx],
                    borderWidth: '1px',
                    color: allTags?.[currencyKey]?.symbolTheme,
                  }}
                >
                  {allTags?.[currencyKey]?.symbol}
                </div>
                <div className='small'>{itemTotals?.[currencyKey]}</div>
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
}
