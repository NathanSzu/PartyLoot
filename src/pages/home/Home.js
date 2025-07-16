import { Container, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const features = [
  {
    text: 'Record updates in real time',
    icon: '/APPIcons/Home/clock-fill.svg',
    alt: 'Real time updates',
  },
  {
    text: 'Collaboratively view party items',
    icon: '/APPIcons/Home/people-fill.svg',
    alt: 'Collaborative tracking',
  },
  {
    text: 'Track customizable currency',
    icon: '/APPIcons/Home/piggy-bank-fill.svg',
    alt: 'Customizable currency',
  },
  {
    text: 'Access unique homebrew items',
    icon: '/APPIcons/Home/shield-fill-plus.svg',
    alt: 'Homebrew library',
  },
];

const actions = [
  {
    text: 'Create account/login',
    button: (
      <LinkContainer to='/login'>
        <Button variant='dark background-dark' className='minw-button' data-cy='get-started'>
          Get Started
        </Button>
      </LinkContainer>
    ),
  },
  {
    text: 'Support us on patreon',
    button: (
      <a href='https://www.patreon.com/dndnathan?fan_landing=true' target='blank'>
        <Button variant='dark background-dark' className='minw-button'>
          Patreon
        </Button>
      </a>
    ),
  },
];

export default function Home() {
  return (
    <Row>
      <Container fluid className='background-light rounded-bottom p-3' data-cy='welcome-message'>
        <Row className='justify-content-center p-3'>
          <Col xs={4} sm={4} md={3} className='p-0'>
            <img
              src='/PWAIcons/PL_Icon.svg'
              fetchpriority='high'
              className='img-fluid rounded-start'
              alt='Party loot icon'
            />
          </Col>
          <Col xs={8} sm={6} md={5} className='text-center background-white rounded-end d-flex align-items-center py-2'>
            <h1 className='w-100'>Welcome to Party Loot</h1>
          </Col>
        </Row>
        <Row>
          <Col sm={10} md={8} className='mx-auto pt-3'>
            <h2 className='text-center background-dark rounded text-light p-2 m-0'>Adventure awaits</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={10} md={8} className='mx-auto pb-3'>
            {features.map(({ text, icon, alt }) => (
              <ul className='list-group list-group-horizontal' key={text}>
                <li className='list-group-item flex-fill d-flex align-items-center fs-sm-deco'>{text}</li>
                <li className='list-group-item d-flex align-items-center'>
                  <img src={icon} alt={alt} width='40' height='40' />
                </li>
              </ul>
            ))}
          </Col>
        </Row>
        <Row>
          <Col sm={10} md={8} className='mx-auto pt-3'>
            <h2 className='text-center background-dark rounded text-light p-2 m-0'>Start tracking today</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={10} md={8} className='mx-auto pb-3'>
            {actions.map(({ text, button }) => (
              <ul className='list-group list-group-horizontal' key={text}>
                <li className='list-group-item flex-fill d-flex align-items-center fs-sm-deco'>{text}</li>
                <li className='list-group-item d-flex align-items-center'>{button}</li>
              </ul>
            ))}
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
