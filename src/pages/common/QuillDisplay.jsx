import React from 'react';

export default function QuillDisplay({ value }) {
  return <div dangerouslySetInnerHTML={{ __html: value }}></div>;
}
