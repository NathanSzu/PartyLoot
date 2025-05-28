import { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../../../../utils/contexts/AuthContext';
import { isLiked, addLike, removeLike } from '../../../../controllers/compendiumController';

export function LikeDisplay({ item }) {
  const { currentUser } = useContext(AuthContext);

  const [fill, setFill] = useState('regular');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const setLikeStatus = async () => {
    setLoading(true);
    try {
      if (liked) {
        await removeLike(item.id, currentUser.uid);
        setLiked(false);
        setFill('regular');
        item.likeCount = (item.likeCount || 0) - 1;
      } else {
        await addLike(item.id, currentUser.uid);
        setLiked(true);
        setFill('solid');
        item.likeCount = (item.likeCount || 0) + 1;
      }
    } catch (err) {
      console.error('Error updating like status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        const likedStatus = await isLiked(item.id, currentUser.uid);
        setLiked(likedStatus);
        setFill(likedStatus ? 'solid' : 'regular');
      } catch (err) {
        console.error('Error fetching liked status', err);
      }
    };

    fetchLikedStatus();
  }, [item, currentUser]);

  return (
    <>
      {item?.id && (
        <p className='m-0'>
          <Button disabled={loading} variant='link text-decoration-none text-dark p-0' onClick={() => setLikeStatus()}>
            {fill === 'solid' ? (
              <img src='APPIcons/heart-fill.svg' alt='Liked' width='16' height='16' />
            ) : (
              <img src='APPIcons/heart.svg' alt='Not Liked' width='16' height='16' />
            )}
            {item?.likeCount || 0}
          </Button>
          {!item?.published && <span class='badge rounded-pill bg-warning ms-2 text-dark'>Unpublished</span>}
        </p>
      )}
    </>
  );
}
