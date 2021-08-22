import React, { Component } from "react";
import Identicon from "identicon.js";
import photo from "../photo.png";

const Navbar = ({ account }) => {
  return (
    <div id="navbar">
      <ul>
        <li>
          <a href="">            {account
              ? <img
                className='ml-2'
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
              />
              : <span></span>
            }</a>
        </li>

        <li>
          <a href="">About</a>
        </li>

        <li>
          <a href="">Work</a>
        </li>

        <li>
          <a href="">Contact</a>
        </li>
      </ul>{" "}
    </div>
  );
};

export default Navbar;
