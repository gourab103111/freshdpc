/* eslint-disable */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './welcome.css';
import '../../BookingStatusLookup.css';
import creds from '../../utils/Config.json';


import xml2js from 'xml2js';

const token = sessionStorage.getItem('token');




const Welcome = ({ data }) => {


  const [fromJson,setfromJson] = useState({
  });


  //Code added By Gourab
const loadJsonFrom = async (filename,dataname) => {
  let res = await axios.get(
    window.location.protocol + "/mySettings/" + filename
  );

  console.log(dataname);
  console.log(res);


  setfromJson((old)=>{
    return {
      dataname: JSON.stringify(res)
    }
  });

  sessionStorage.setItem(dataname, JSON.stringify(res));
  localStorage.setItem(dataname,JSON.stringify(res))
  return true;
};
//Code added By Gourab

  const [jsonLoaded,setjsonLoaded] = useState(false);

  const [payment, setPayment] = useState(false);
  console.log('this is in the welcome page', data);
  // const [errRedirect, setErrRedirect] = useState(false);
  // const [respdata, setRespdata] = useState();

  // var display = true;
  const history = useHistory();
  useEffect(() => {
    if (!sessionStorage.getItem('urltoken')) {
      history.push('/error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  useEffect(() => {



    /*
    console.log("This load once 2");

    let rval = loadJsonFrom("BookingStatusLookup.json","BookingStatusLookup");
    if(rval){

      console.log(fromJson["BookingStatusLookup"]);
      console.log(sessionStorage.getItem("BookingStatusLookup"));

    //  rval =  loadJsonFrom("Config.json","Config");
      if(rval){
       
        rval =  loadJsonFrom("EmailSms.json","EmailSms");
        if(rval){
          rval =  loadJsonFrom("OrgFilterChapterInfo.json","OrgFilterChapterInfo");
          if(rval){
            rval =  loadJsonFrom("TermsAndConditions.json","TermsAndConditions");
            setjsonLoaded(true);
          }
        }
      }
    
    }

    */

    setjsonLoaded(true);

  }, []);

  useEffect(() => {

    if(jsonLoaded){
    const query = new URLSearchParams(window.location.search);
    console.log(sessionStorage.getItem('urltoken'));
    if (
      !query.get('token') &&
      (sessionStorage.getItem('urltoken') === undefined ||
        sessionStorage.getItem('urltoken') === null)
    ) {
      // setErrRedirect(true);
      return;
    } else {
      sessionStorage.setItem('urltoken', query.get('token'));
    }


    if (window.location.pathname === "/welcome") {
      displaydata(
        sessionStorage.getItem("setSessionId"),
        sessionStorage.getItem("strBookingStatus")
      );
      return;
    }

    


    let data = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Header>\r\n    <AuthHeader xmlns="http://tempuri.org/">\r\n      <LoginToken>${
      query.get('token') || token
    }</LoginToken>\r\n      <Username>${
      creds.username
    }</Username>\r\n      <Password>${
      creds.password
    }</Password>\r\n    </AuthHeader>\r\n  </soap12:Header>\r\n  <soap12:Body>\r\n    <LoginByToken3 xmlns="http://tempuri.org/" />\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
    let config = {
      method: 'post',
      url: creds.serviceurl,
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        let parser = new xml2js.Parser();
        parser.parseString(`${response.data}`, function (err, result) {
          const resultData =
            result['soap:Envelope']['soap:Body'][0]['LoginByToken3Response'][0][
              'LoginByToken3Result'
            ][0];
          const ObjectKeys = Object.keys(resultData);
          let _data = {};
          ObjectKeys.forEach((e) => {
            _data[e] = resultData[e][0];
          });
          console.log('this is called in the welcome page', _data);

          sessionStorage.setItem("setSessionId", _data.strSessionID);
          sessionStorage.setItem("strBookingStatus", _data.strBookingStatus);


          // setRespdata(_data);
          displaydata(_data.strSessionID, _data.strBookingStatus);
          // setData(_data);
        });
      })
      .catch((error) => {
        console.log(error);
        // setErrRedirect(true);
      });

    }
  }, [jsonLoaded]);

  function displaydata(id, status) {
    if (id.length > 4) {
      setPayment(true);
    }
    if (status) {
      
      /*var value = utils[status].htmlcontent;
      for (let i = 0; i < value.length; i++) {
        document.getElementById('content').innerHTML += value[i];
      }*/

      let htmlcontent = sessionStorage.getItem("htmlcontent");
      if (htmlcontent) {
        let htmlcontent = JSON.parse(sessionStorage.getItem("htmlcontent"));
        if (htmlcontent.display === "on") {
          /***  Used To add css dynamickly start  */
          var link = document.createElement("link");
          link.id = sessionStorage.getItem("strStatus");
          link.rel = "stylesheet";
          link.href = "mySettings/BookingStatusLookup.css";
          document.head.appendChild(link);

          /***  Used To add css dynamickly end  */

          var value = htmlcontent.htmlcontent;

          document.getElementById("content").innerHTML = "";

          for (let i = 0; i < value.length; i++) {
            document.getElementById("content").innerHTML += value[i];
          }
        }
      }


    }
    // }
  }

  if(window.location.pathname==="/welcome"){

    
  }else{
    return(
          <>
           <center>Please wait ......</center>
          </>
      );
  }

  return (
    <div className='welcome_container'>
      {/* <button onClick={sendemail}>Send Email</button> */}
      <h5>
        Welcome,
        <br /> {data.strFirstName}&nbsp;{data.strLastName}
      </h5>
      <br />
      {/* {displaydata()} */}
      <p>
        Thank you for participating in your recent photography day!
        <br />
        You are almost finished.
      </p>

      <div
        className='complete_cont'
        style={{ paddingLeft: '5px' }}
        id='content'
      ></div>

      <div className='complete_cont' style={{ paddingLeft: '5px' }}>
        <p className='complete'>
          <img src='/tick.png' alt='Tick' />
          Complete and verify your personal information
        </p>
        <p className='complete'>
          <img src='/tick.png' alt='Tick' />
          Finalize your pose selection
        </p>
        {payment ? (
          <p className='complete'>
            <img src='/tick.png' alt='Tick' />
            Pay your sitting fee, if required
          </p>
        ) : (
          ''
        )}
      </div>
      <br />
      <Link to='/check-details'>
        <button>
          Continue&nbsp;<i className='fas fa-chevron-right'></i>
          <i className='fas fa-chevron-right'></i>
        </button>
      </Link>
    </div>
  );
};

export default Welcome;
