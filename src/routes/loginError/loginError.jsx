/* eslint-disable */
import "./loginError.css";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const LoginError = (props) => {
  

  useEffect(() => {
    let htmlcontent = sessionStorage.getItem("htmlcontent");

    
    
    if (htmlcontent) {
       htmlcontent = JSON.parse(sessionStorage.getItem("htmlcontent"));
      if (htmlcontent.display === "on") {
        var value = htmlcontent.htmlcontent;

        document.getElementById("content").innerHTML = "";

        for (let i = 0; i < value.length; i++) {
          document.getElementById("content").innerHTML += value[i];
        }
      }
    }
   
    
  }, []);

  return (
    <div className="error_cont">
      <div className="head">
        <div></div>
        <h5>Oh, no!</h5>
        <div></div>
      </div>
      <div className="body" id="content">
        <p>Check back soon, your photos are not quite ready. Thanks!</p>
      </div>
    </div>
  );
};

export default LoginError;
