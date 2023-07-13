import React from 'react';

export function SingleLineLoading({ classProps }) {
  const concatClasses = (classProps = '') => {
    let classes = 'load-container position-relative rounded ';
    classes += classProps;
    return classes;
  };

  return (
    <div className={concatClasses(classProps)}>
      <div className='load-wrapper'>
        <div className='activity'></div>
      </div>
    </div>
  );
}

export function ParagraphLoading({ classProps }) {
  return (
    <>
      <SingleLineLoading classProps={classProps}/>
      <SingleLineLoading classProps={classProps + ' mt-1'}/>
      <SingleLineLoading classProps={classProps + ' mt-1'}/>
      <SingleLineLoading classProps={classProps + ' mt-1'}/>
      <SingleLineLoading classProps={classProps + ' mt-1'}/>
    </>
  );
}
