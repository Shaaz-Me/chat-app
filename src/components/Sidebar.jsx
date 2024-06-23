import React, { useState } from "react";
import Navbar from "./Navbar"
import Search from "./Search"
import Chats from "./Chats"
import Sections from "./Sections";
import ActiveUsers from "./ActiveUsers";

const Sidebar = () => {
  const [section, setSection] = useState('CHATS');
  return (
    <div className="sidebar">
      <Navbar />
      <Sections section={section} setSection={setSection} />
      {section === 'CHATS' && <Search/>}
      {section === 'CHATS' && <Chats/>}
      {section === 'ACTIVE_USERS' && <ActiveUsers setSection={setSection} />}
    </div>
  );
};

export default Sidebar;
