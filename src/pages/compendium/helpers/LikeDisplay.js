import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../../../utils/contexts/AuthContext';
import fb from 'firebase';

export default function LikeDisplay({
  liked,
  color = '#3a343f',
  likeCount = 0,
  badges = [],
  loading,
  setLoading,
  item,
}) {
  const { currentUser, db } = useContext(AuthContext);

  const [fill, setFill] = useState('regular');
  const [likeModifier, setLikeModifier] = useState(0);

  const itemRef = db.collection('compendium').doc(item.id);
  const collectionRef = itemRef.collection('likes');

  const setLikeStatus = () => {
    setLoading(true);
    liked ? removeLike() : addLike();
  };

  const addLike = () => {
    likeModifier === 0 ? setLikeModifier(1) : setLikeModifier(0);
    setFill('solid');
    collectionRef
      .doc(currentUser.uid)
      .set({ timestamp: fb.firestore.FieldValue.serverTimestamp() })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error recording like', err);
      });
  };

  const removeLike = () => {
    likeModifier === 0 ? setLikeModifier(-1) : setLikeModifier(0);
    setFill('regular');
    collectionRef
      .doc(currentUser.uid)
      .delete()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error removing like', err);
      });
  };

  useEffect(() => {
    liked ? setFill('solid') : setFill('regular');
  }, [liked]);

  useEffect(() => {
    setLikeModifier(0);
  }, [item])

  return (
    <p className='m-0'>
      <Button
        disabled={loading}
        variant='link text-decoration-none text-dark px-0 pt-1 pb-0'
        onClick={() => setLikeStatus()}
      >
        <i className={`fa-${fill} fa-heart`} style={{ color: color }} /> {likeCount + likeModifier}{' '}
        {badges.length > 0 && '| Category'}
      </Button>
    </p>
  );
}
