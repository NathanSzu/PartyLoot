import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { GlobalFeatures } from '../../utils/contexts/GlobalFeatures';

export default function ButtonShareLink({ variant = 'dark', bg = 'background-dark', width = 'w-100' }) {
    const { toggleShowToast, setToastContent, setToastHeader } = useContext(GlobalFeatures)

    const copyShareLink = () => {
        navigator.clipboard.writeText('https://partyloottracker.com/');
        setToastHeader('Link Copied');
        setToastContent('Paste the link into a messenger of your choice and send to one friend, or as many as you can think of! Thank you for sharing!');
        toggleShowToast();
    }
    return <Button variant={variant} className={`${bg} ${width} mb-2`} onClick={copyShareLink}>Share with a friend</Button>;
}
