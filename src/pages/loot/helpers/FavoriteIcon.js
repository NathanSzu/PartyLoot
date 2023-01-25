import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';

export default function FavoriteIcon({ currentGroupData, itemOwnerId, groupRef }) {
    const { currentUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const checkFavorite = () => {
        if (currentGroupData.favorites && currentGroupData.favorites[currentUser.uid] === itemOwnerId) {
            return true
        } else {
            return false
        };
    }

    const setFavoriteItemOwner = () => {
        setLoading(true)
        groupRef.update({
            [`favorites.${currentUser.uid}`]: itemOwnerId
        }).then(() => {
            setLoading(false)
        }).catch((err) => {
            console.error(err.code);
            console.error(err.message)
        })
    }

    return (
        <>
            <Button disabled={loading} variant="outline-light" className="p-0" onClick={setFavoriteItemOwner}>
                {checkFavorite() ? <img className="m-2" alt="Favorited" src='APPIcons/star-fill.svg' /> : <img className="m-2" alt="Not Favorited" src='APPIcons/star.svg' />}
            </Button>
        </>
    )
}
