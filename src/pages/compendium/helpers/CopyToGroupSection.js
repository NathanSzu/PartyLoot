import React from 'react';

export default function CopyToGroupSection() {
  return (
    <form className='row border-top pt-3' onSubmitCapture={(e) => e.preventDefault()}>
        <h2 className='fs-sm-deco'>Save to a group?</h2>
        <div class='mb-3 col-6'>
          <label for='groupSelect' class='form-label'>
            Group
          </label>
          <select class='form-select' id='groupSelect' aria-label="Select group" />
        </div>
        <div class='mb-3 col-6'>
          <label for='ownerSelect' class='form-label'>
            Owner
          </label>
          <select class='form-select' id='ownerSelect' aria-label="Select owner"/>
        </div>
        <div className='col-12 text-end'>
        <button type='submit' class='btn btn-primary'>
          Send to group
        </button>
        </div>
    </form>
  );
}
