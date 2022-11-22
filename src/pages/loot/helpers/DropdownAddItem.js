import React from 'react';
import { Dropdown } from 'react-bootstrap';

export default function DropdownAddItem({ setSearchSRD }) {
	return (
		<Dropdown>
			<Dropdown.Toggle className='w-100' variant="dark" id="dropdown-add-content"></Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item onClick={() => {setSearchSRD(true)}}>Search open source content</Dropdown.Item>
                <Dropdown.Divider/ >
				<Dropdown.Item href="https://www.dndbeyond.com/magic-items" target='_blank' >Copy from D&D Beyond</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
}
