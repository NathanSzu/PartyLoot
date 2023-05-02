import React, { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function QuillInput({ defaultValue, value, setValue, placeholder }) {
  const modules = {
    toolbar: [
      [{ size: [false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', { color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ],
  };

  useEffect(() => {
    defaultValue && setValue(defaultValue);
  }, []);

  return <ReactQuill theme='snow' modules={modules} placeholder={placeholder} value={value} onChange={setValue} />;
}
