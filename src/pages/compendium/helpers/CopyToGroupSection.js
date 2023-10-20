import React, { useContext } from 'react';
import { GroupContext } from '../../../utils/contexts/GroupContext';

export default function CopyToGroupSection() {
  const { groups } = useContext(GroupContext);

  return (
    <form className='row border-top pt-3' onSubmitCapture={(e) => e.preventDefault()}>
      <h2 className='fs-sm-deco'>Save to a group?</h2>
      <div className='mb-3 col-6'>
        <label htmlFor='groupSelect' className='form-label'>
          Group
        </label>
        <select className='form-select' id='groupSelect' aria-label='Select group' />
      </div>
      <div className='mb-3 col-6'>
        <label htmlFor='ownerSelect' className='form-label'>
          Owner
        </label>
        <select className='form-select' id='ownerSelect' aria-label='Select owner' />
      </div>
      <div className='col-12 text-end'>
        <button type='submit' className='btn btn-primary'>
          Send to group
        </button>
      </div>
    </form>
  );
}
