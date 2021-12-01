import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../utils/contexts/AuthContext';
import star from '../assets/star.svg';
import starFill from '../assets/star-fill.svg';

export default function FavoriteIcon({ currentGroupData, member, groupRef }) {
    const { currentUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const checkFavorite = () => {
        if (currentGroupData.favorites && currentGroupData.favorites[currentUser.uid] === member) {
            return true
        } else {
            return false
        };
    }

    const setFavoriteMember = () => {
        setLoading(true)
        groupRef.update({
            [`favorites.${currentUser.uid}`]: member
        }).then(() => {
            setLoading(false)
        }).catch((err) => {
            console.log(err.code);
            console.log(err.message)
        })
    }

    return (
        <>
            <Button disabled={loading} variant="outline-light" className="p-0" onClick={setFavoriteMember}>
                {checkFavorite() ? <img className="m-2" alt="Favorited" src={starFill} /> : <img className="m-2" alt="Not Favorited" src={star} />}
            </Button>
        </>
    )
}
