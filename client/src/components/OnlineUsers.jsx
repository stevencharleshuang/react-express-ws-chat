import React from 'react';

export default function OnlineUsers(props) {
  let users = props.onlineUsers;
  // console.log('OnlineUsers props: ', props);
  let currentUsers = users.map((user) => {
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
