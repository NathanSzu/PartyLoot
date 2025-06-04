import { useState } from 'react';
import { Row, Tab, Tabs } from 'react-bootstrap';
import { CompendiumList } from './helpers/compendiumItemLists/CompendiumList';
import { searchMagicItems } from '../../controllers/open5eController';
import { searchCompendium } from '../../controllers/compendiumController';

export default function Compendium() {
  const [key, setKey] = useState('ogl');

  return (
    <Row>
      <Tabs
        id='compendium-tabs'
        variant='tabs'
        justify
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className='background-light pe-0 pt-2'
      >
        <Tab eventKey='ogl' title='OGL Content'>
          <CompendiumList searchItems={searchMagicItems} />
        </Tab>
        <Tab eventKey='community' title='Homebrew'>
          <CompendiumList searchItems={searchCompendium} isCompendium={true} />
        </Tab>
      </Tabs>
    </Row>
  );
}
