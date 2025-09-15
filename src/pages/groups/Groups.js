import { useContext } from 'react';
import { Row, Col, Spinner, Container, Navbar } from 'react-bootstrap';
import { GroupContext } from '../../utils/contexts/GroupContext';
import { GlobalFeatures } from '../../utils/contexts/GlobalFeatures';
import AddGroup from './helpers/AddGroup';
import PatchNotes from './helpers/PatchNotes';
import GroupCard from './helpers/GroupCard';
import IntroCard from './helpers/IntroCard';
import ButtonShareLink from '../common/ButtonShareLink';

export default function Groups() {
  const { groupList } = useContext(GroupContext);
  const { checkLocalStorage } = useContext(GlobalFeatures);

  return (
    <Row className='lazy-scroll-container'>
      <Navbar sticky='top' className='theme1-backer rounded-bottom mb-2' id='sticky-group-add'>
        <p className='fancy-font fs-md-deco text-light m-auto'>
          Tap <AddGroup /> to create a new group.
        </p>
      </Navbar>

      <Container>
        <Row>
          <PatchNotes />

          {!groupList ? (
            <Spinner
              as='div'
              className='d-flex mt-4 loading-spinner'
              animation='border'
              role='status'
              variant='light'
            />
          ) : (
            <>
              {
                <Col lg={4} className='d-none top-0 d-lg-block mx-auto'>
                  <Container>
                    <Row>
                      <Col xs={12} className='p-0'>
                        <img src='/PWAIcons/PL_512.png' alt='Party Loot' className='rounded-top mw-100' />
                      </Col>
                      <Col xs={12} className='text-center rounded-bottom py-3 mt-auto background-light'>
                        <h1 className='fs-md-deco text-dark'>Welcome to Party Loot</h1>
                        <ButtonShareLink width='' />
                      </Col>
                    </Row>
                  </Container>
                </Col>
              }
              <Col>
                {
                  <>
                    {!checkLocalStorage('groupIntroCard') && <IntroCard />}
                    {groupList.map((group, idx) => (
                      <GroupCard group={group} idx={idx} key={idx} />
                    ))}
                  </>
                }
              </Col>
            </>
          )}
        </Row>
      </Container>
    </Row>
  );
}
