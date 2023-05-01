import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

export default function QuillDisplay({ value }) {
  return <ReactQuill theme='bubble' className='quill-display' readOnly={true} value={value} />;
}
