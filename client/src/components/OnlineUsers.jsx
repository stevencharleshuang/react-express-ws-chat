import React from 'react';

export default function OnlineUsers(props) {
  let users = props.users;
  // console.log('OnlineUsers props: ', props);
  let currentUsers = props.onlineUsers.map((user) => {
    return (
      <li key={user}>{user}</li>
    );
  });
  return (
    <div className="online-users">
      <ul>
        {currentUsers}
      </ul>
    </div>
  );
}
