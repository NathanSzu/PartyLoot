import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { GlobalFeatures } from '../../utils/contexts/GlobalFeatures';

export default function ButtonShareLink() {
    const { toggleShowToast, setToastContent, setToastHeader } = useContext(GlobalFeatures)

    const copyShareLink = () => {
        navigator.clipboard.writeText('https://partyloottracker.com/');
        setToastHeader('Link Copied');
        setToastContent('Paste the link into a messenger of your choice and send to one friend, or as many as you can think of! Thank you for sharing!');
        toggleShowToast();
    }
    return <Button variant={'dark'} className='background-dark w-100 mb-2' onClick={copyShareLink}>Share with a friend</Button>;
}
