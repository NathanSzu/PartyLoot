import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

export default ({ itemDesc, setItemDesc, placeholder = 'Item description' }) => {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ list: 'ordered' }],
      [{ align: [] }],
    ],
  };

  const formats = ['bold', 'italic', 'underline', 'strike', 'list', 'indent', 'align'];

  const { quill, quillRef } = useQuill({ modules, formats, placeholder });

  useEffect(() => {
    // Docs available at https://www.npmjs.com/package/react-quilljs
    if (quill) {
      itemDesc && quill.clipboard.dangerouslyPasteHTML(itemDesc);
      quill.on('text-change', (delta, oldDelta, source) => {
        setItemDesc(quill.root.innerHTML);
      });
    }
  }, [quill]);

  return (
    <Col xs={12}>
      <div ref={quillRef} />
    </Col>
  );
};
