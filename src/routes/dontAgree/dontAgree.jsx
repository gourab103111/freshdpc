/* eslint-disable */
import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./dontAgree.css";

const DontAgree = (props) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);
  return (
    <div className="dont_agree_cont">
      <div className="head">
        <div>
        <Link to="/persional-info">
          <span>
            <i className="fas fa-chevron-left"></i>&nbsp;Back
          </span>
        </Link>
        </div>
      </div>
      <div className="head head2">
        <div>
        
        </div>
        <div>
        <h5 className="boldfont">Oh, no!</h5>
        </div>
        <div ></div>
      </div>
      <div className="body">
        <p className="boldfont">
          We are sorry to hear that you did not accept our Terms & Conditions.
          We will notify your organization that you do not wish to participate.
        </p>
        <br />
        <p className="boldfont">Change your mind? Click the button below to go back.</p>
        <br />
        <br />
        <div></div>
        <Link to="/persional-info">
          <button>
            <i className="fas fa-chevron-left"></i>
            <i className="fas fa-chevron-left"></i>&nbsp;Go Back
          </button>
        </Link>
        {/* <p className="go-back">Go back to the previous page</p> */}
      </div>
    </div>
  );
};

export default DontAgree;
