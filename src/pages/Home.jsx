import React, { useContext, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import { doc, updateDoc } from 'firebase/firestore'
import { AuthContext } from '../context/AuthContext'
import { db } from '../firebase'

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const updateUserLoginStatus = async (loggedIn) => {
      const userRef = doc(db, "users", currentUser.uid);
  
      await updateDoc(userRef, {
        isLoggedIn: loggedIn
      });
    }
    updateUserLoginStatus(true);
  
    return () => {
      updateUserLoginStatus(false);
    }
  }, [currentUser.uid])
  
  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default Home