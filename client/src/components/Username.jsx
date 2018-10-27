import React from 'react';

export default function Username(props) {
  // console.log('Username props:', props);
  return(
    <div className="username-form">
      <form>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          onChange={props.handleOnChange}
        />
        {/* <br />
        <input
          type="text"
          id="password"
          name="password"
          placeholder="Password"
          onChange={this.handleOnChange}
        /> */}
        <br />
        <button onClick={props.handleUsernameSubmit} data-id="submit">Submit</button>
      </form>
    </div>
  );
}