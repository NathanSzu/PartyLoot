import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { GroupContext } from '../utils/GroupContext';
import firebase from '../utils/firebase';

export default function Loot() {
  const { currentUser } = useContext(AuthContext);
  const { currentGroup, setCurrentGroup } = useContext(GroupContext);

  useEffect(() => {
    console.log('currentUser: ', currentUser)
    console.log('currentGroup: ', currentGroup)
  }, [])

  return (
    <div>

    </div>
  )
}
