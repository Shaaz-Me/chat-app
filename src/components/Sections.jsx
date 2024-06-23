import React from 'react'

const Sections = ({section, setSection}) => {
  return (
    <div className='sections'>
        <div className="allChats" style={{color: `${section === 'CHATS'? "black":"lightyellow"}`, backgroundColor: `${section === 'CHATS'? "gainsboro":"#3e3c61"}`}} onClick={() => setSection('CHATS')}>Chat</div>
        <div className="activeUsers" style={{color: `${section === 'ACTIVE_USERS'? "black":"lightyellow"}`, backgroundColor: `${section === 'ACTIVE_USERS'? "gainsboro":"#3e3c61"}`}} onClick={() => setSection('ACTIVE_USERS')}>Active Users</div>
    </div>
  )
}

export default Sections