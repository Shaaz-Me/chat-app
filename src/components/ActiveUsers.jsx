import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';

const ActiveUsers = ({setSection}) => {
    const { currentUser } = useContext(AuthContext);
    const [ loggedUser, setLoggedUser ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        setLoading(true);
        const getAllLoggedInUser = () => {
            const q = query(
                collection(db, "users"),
                where("isLoggedIn", "==", true)
            );

            try {
                const unSubLoggedInUser = onSnapshot(q, (doc) => {
                    const loggedInUser = doc.docs.filter(item => item.data().uid !== currentUser.uid).map((item) => item.data());
                    setLoggedUser(loggedInUser);
                    setLoading(false);
                });
                return unSubLoggedInUser;
            } catch (err) {
                console.log(err)
            }
        }
        const unSubLoggedInUser = getAllLoggedInUser();

        return () => {
            unSubLoggedInUser();
            setLoading(false);
        }
    }, [currentUser.uid]);



    const handleSelect = async (user) => {
        //check whether the group(chats in firestore) exists, if not create
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                //create a chat in chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                //create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) { }
        setSection('CHATS');
        const userInfo = {displayName: user.displayName, photoURL:user.photoURL, uid: user.uid};
        dispatch({ type: "CHANGE_USER", payload: userInfo });
    };
    
  return (
      <>
          {loading && <div style={{ margin: "5px auto 0 auto", textAlign: "center", color: "lightyellow" }}>Loading...</div>}
          {!loading && loggedUser && loggedUser.sort((a,b) => a.displayName.localeCompare(b.displayName)).map(user => (
              <div key={user.uid} className="userChat" onClick={() => handleSelect(user)}>
                  <img src={user.photoURL} alt="" />
                  <div className="userChatInfo">
                      <span>{user.displayName}</span>
                  </div>
              </div>
          ))}
      </>
  )
}

export default ActiveUsers