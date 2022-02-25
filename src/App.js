/* eslint-disable */
import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header/header";
import Welcome from "./routes/welcome/welcome";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import CheckDetails from "./routes/checkDetails/checkDetails";
import PersionalInfo from "./routes/persionalInfo/persionalInfo";
import DontAgree from "./routes/dontAgree/dontAgree";
import Favourites from "./routes/favourites/favourites";
import Selected from "./routes/selected/selected";
import ForwardToPayment from "./routes/forwardToPayment/forwardToPayment";
import Completed from "./routes/completed/completed";
import axios from "axios";
import xml2js from "xml2js";
import LoginError from "./routes/loginError/loginError";
import creds from "./utils/Config.json";
import LoginErrorCustom from "./routes/loginError/loginErrorCustom";

//Prakash Start addition
//const token = sessionStorage.getItem('token');
let token;
const query = new URLSearchParams(window.location.search);
if (query.get("token")) {
  token = query.get("token");
  sessionStorage.setItem("urltoken", query.get("token"));
  sessionStorage.setItem("token", query.get("token"));
  
}
//Prakash end


//Code added By Gourab
const loadJsonFrom = async (filename,dataname) => {
  let res = await axios.get(
    window.location.protocol + "/mySettings/" + filename
  );

  sessionStorage.setItem(dataname, JSON.stringify(res));
  localStorage.setItem(dataname,JSON.stringify(res))
  return true;
};
//Code added By Gourab

function App() {
  const [data, setData] = useState({});
  const [errRedirect, setErrRedirect] = useState(false);
  const [redirectWellcome, setredirectWellcome] = useState(false);
  const [errRedirectCustom, setErrRedirectCustom] = useState(false);
 
  
  const [jsonLoaded,setjsonLoaded] = useState(false);
  
  const [CustomerId,setCustomerId] = useState(null);

 // const jsonnames = ["BookingStatusLookup.json","Config.json","EmailSms.json","OrgFilterChapterInfo.json","TermsAndConditions.json"];


  
 useEffect(() => {

  //console.log("This load once 1");


  let rval = loadJsonFrom("BookingStatusLookup.json","BookingStatusLookup");
  if(rval){
    console.log("This load once A1 ");
   // console.log(sessionStorage.getItem("BookingStatusLookup"));
   //console.log(localStorage.getItem("BookingStatusLookup"));
    //rval =  loadJsonFrom("Config.json","Config");
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

}, []);
  useEffect(() => {

  if(jsonLoaded){

   
    

    if (!query.get("token")) {
      sessionStorage.removeItem("token");
    }
    sessionStorage.removeItem("customerId");
    sessionStorage.removeItem("organization");
    sessionStorage.removeItem("selectedData");
    sessionStorage.removeItem("bookingPath");
    sessionStorage.removeItem("bookingId");
    sessionStorage.removeItem("strBookingPkid");
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("selectedImages");
    sessionStorage.removeItem("radiooption");
    sessionStorage.removeItem("selectedvalue");
    sessionStorage.removeItem("textvalue");

    //const query = new URLSearchParams(window.location.search);
    console.log(sessionStorage.getItem("urltoken"));
    if (
      !query.get("token") &&
      (sessionStorage.getItem("urltoken") === undefined ||
        sessionStorage.getItem("urltoken") === null)
    ) {
      setErrRedirect(true);
      return;
    } else {
      sessionStorage.setItem("urltoken", query.get("token"));
    }

    let data = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Header>\r\n    <AuthHeader xmlns="http://tempuri.org/">\r\n      <LoginToken>${
      query.get("token") || token
    }</LoginToken>\r\n      <Username>${
      creds.username
    }</Username>\r\n      <Password>${
      creds.password
    }</Password>\r\n    </AuthHeader>\r\n  </soap12:Header>\r\n  <soap12:Body>\r\n    <LoginByToken3 xmlns="http://tempuri.org/" />\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
    let config = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        let parser = new xml2js.Parser();
        parser.parseString(`${response.data}`, function (err, result) {
          const resultData =
            result["soap:Envelope"]["soap:Body"][0]["LoginByToken3Response"][0][
              "LoginByToken3Result"
            ][0];
          const ObjectKeys = Object.keys(resultData);
          let _data = {};
          ObjectKeys.forEach((e) => {
            _data[e] = resultData[e][0];
          });
          setData(_data);
          sessionStorage.setItem("token", _data.strToken);
          sessionStorage.setItem("customerId", _data.strCustomerId);
          console.log(_data);
          //Added By Gourab
          setCustomerId(_data.strCustomerId);
        });
      })
      .catch((error) => {
        console.log(error);
        setErrRedirect(true);
      });

    }
  }, [jsonLoaded]);

  useEffect(() => {

    

    let data1 = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n
    <soap12:Body>\r\n
      <GetBookingInfoPS xmlns="http://tempuri.org/">\r\n 
          <strCustomerId>${CustomerId}</strCustomerId>\r\n 
      </GetBookingInfoPS>\r\n 
    </soap12:Body>\r\n
  </soap12:Envelope>`;

    let config1 = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: data1,
    };

    axios(config1)
      .then((response) => {
        let parser1 = new xml2js.Parser();
        parser1.parseString(`${response.data}`, function (err, result) {
          const resultData1 =
            result["soap:Envelope"]["soap:Body"][0][
              "GetBookingInfoPSResponse"
            ][0]["GetBookingInfoPSResult"][0];
          const ObjectKeys1 = Object.keys(resultData1);
          let _data = {};
          ObjectKeys1.forEach((e) => {
            _data[e] = resultData1[e][0];
          });


         
          sessionStorage.setItem("strStatus", _data.strStatus);
       
          /// Code added by Gourab
        const response2 = JSON.parse(sessionStorage.getItem("BookingStatusLookup")); 

       
        let  statusData = response2.data[_data.strStatus];

        if(statusData === undefined){
          return;
        }
  
  
    const statusDat = statusData.value;
        if (statusDat === "Active") {
          sessionStorage.setItem(
            "htmlcontent",
            JSON.stringify(statusData)
          );
          setredirectWellcome(true);
          setErrRedirect(false);
          setErrRedirectCustom(false);
        }

        if (statusDat === "Error") {

          sessionStorage.setItem(
            "htmlcontent",
            JSON.stringify(statusData)
          );

         
          setredirectWellcome(false);
          setErrRedirectCustom(true);
          setErrRedirect(false);
        }

         /// Code added by Gourab

        });
      })
      .catch((error) => {
        console.log(error);
       setErrRedirect(true);
      });
  }, [CustomerId]);



  return (
    <Router>
      
      {errRedirect && jsonLoaded && <Redirect to="/error" />}
      {redirectWellcome && jsonLoaded && <Redirect to="/welcome" />}
      {errRedirectCustom && jsonLoaded && <Redirect to="/errorpage" />}
     
      
       {jsonLoaded && 
      <div className="App">
        <div className="header">
          <Header />
        </div>
        <div className="body">
        <Route path="/errorpage" exact>
            <LoginErrorCustom data={data}  />
          </Route>
          <Route path="/welcome" exact>
            <Welcome data={data} />
          </Route>
          <Route path="/login" exact>
            <Welcome data={data} />
          </Route>
          <Route path="/check-details" exact>
            <CheckDetails data={data} />
          </Route>
          <Route path="/persional-info" exact>
            <PersionalInfo data={data} />
          </Route>
          <Route path="/dont-agree" exact>
            <DontAgree data={data} />
          </Route>
          <Route exact path="/favourites">
            <Favourites data={data} />
          </Route>
          <Route exact path="/selected">
            <Selected data={data} />
          </Route>
          <Route exact path="/forward">
            <ForwardToPayment data={data} />
          </Route>
          <Route exact path="/completed">
            <Completed data={data} />
          </Route>
          <Route exact path="/error" component={LoginError}></Route>
        </div>
      </div>
}
    </Router>
  );
}

export default App;
