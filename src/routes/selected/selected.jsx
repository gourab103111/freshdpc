/* eslint-disable */
import { Dialog } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Slider from "react-slick";
import "./selected.css";
import xml2js from "xml2js";
import creds from "../../utils/Config.json";
//import Emaildata from '../../utils/EmailSms.json';

function NextArrow(props) {
  const { className, style, onClick, currentSlide, slideCount } = props;
  if (currentSlide + 1 === slideCount) return null;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick, currentSlide } = props;
  if (currentSlide === 0) return null;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    />
  );
}

const Selected = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [imageSelectionNo, setImageSelectionNo] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [redirect1, setRedirect1] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [onlyOne, setonlyOne] = useState(false);

  const [presentslide,setPresetslide] = useState(null);
  const [selectedsl,selectedSlide] = useState(0);
 

  const customerId = sessionStorage.getItem("customerId");
  const bookingId = sessionStorage.getItem("strBookingPkid");

  var reqData = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n    <GetSuppliersPS xmlns="http://tempuri.org/">\r\n      <strCustomerId>${customerId}</strCustomerId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <strFkBookingId>${bookingId}</strFkBookingId>\r\n    </GetSuppliersPS>\r\n  </soap:Body>\r\n</soap:Envelope>`;

  var config = {
    method: "post",
    url: creds.serviceurl,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
    data: reqData,
  };

  useEffect(()=>{
    if(presentslide!=null){
     presentslide.slickGoTo(selectedsl,false);
     }
   },[presentslide]);


   const [settings ,setsettings] = useState({
    dots: false,
    infinite: false,
   
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  });

  const [pval,setpval] = useState("none");
  const [cval,setcval] = useState("none");

  useEffect(()=>{
    //console.log("Check data");
   // console.log(selectedData);

    setpval("none");
    setcval("none");

    if (selectedData !== null) {
      selectedData.forEach((newone) => {
        
        
          if (newone.p === true) {
            setpval(newone.id)
          }

          if (newone.c === true) {
            setcval(newone.id)
          }
       
      });
    }

  },[selectedData]);

  
  useEffect(() => {
    const selecteddata = JSON.parse(sessionStorage.getItem("selectedImages"));
    // console.log("in selected page",selecteddata[0]);
    // sessionStorage.removeItem("selectedImages");
    const data = JSON.parse(sessionStorage.getItem("selectedData"));

    console.log(data);
    data.forEach((ele, index) => {
      ele.c = false;
      ele.p = false;

      if (selecteddata !== null) {
        selecteddata.forEach((newone) => {
          if (newone.id === ele.id) {
            ele.c = newone.c;
            ele.p = newone.p;
            if (newone.p === true || newone.c === true) {
              setIsDisabled(false);
            }
          }
        });
      }
    });

    setSelectedData(data);
    axios(config)
      .then(function (response) {
        const str = response.data
          .split(
            // eslint-disable-next-line no-useless-escape
            `<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><soap:Body><GetSuppliersPSResponse xmlns=\"http://tempuri.org/\">`
          )[1]
          .split("</GetSuppliersPSResponse>")[0];
        const parser = new xml2js.Parser();
        parser.parseString(String(str), function (err, result) {
          console.log(result);
          setImageSelectionNo(
            result.GetSuppliersPSResult.nRawImageSelectionNo[0]
          );
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    setTimeout(() => {
      setIsOpen(false);
    }, 3500);

    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sendemail() {
    const response2 = JSON.parse(sessionStorage.getItem("EmailSms"));
    const Emaildata = response2.data;

    const userData = JSON.parse(sessionStorage.getItem("userData"));
    var body =
      data.strSessionID.length > 4 ? Emaildata.Bodyforpayment : Emaildata.Body;
    var emaildata =
      '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n   <SendMail3_S xmlns="http://tempuri.org/">\r\n      <strMessage></strMessage>\r\n      <strFrom>noreply@dpc.com</strFrom>\r\n      <strSendTo>' +
      userData.email +
      "</strSendTo>\r\n      <strSubject>" +
      Emaildata.Subject +
      "</strSubject>\r\n      <strBody>\r\n  " +
      body +
      " </strBody>\r\n      <strType>Order</strType> \r\n      <strCC>" +
      Emaildata.CC +
      "</strCC>\r\n      <strFkRegisterId>" +
      data.strPkid +
      "</strFkRegisterId>\r\n      <strAttachmentPaths>\r\n       null\r\n      </strAttachmentPaths>\r\n    </SendMail3_S>\r\n  </soap12:Body>\r\n</soap12:Envelope>";
    emaildata = emaildata.replace("<$_Firstname>", userData.firstName);
    emaildata = emaildata.replace("<$_Lastname>", userData.lastName);
    
    emaildata = emaildata.replace("<$_ComposeImage>", cval);
    emaildata = emaildata.replace("<$_PortraitImage>", pval);
   
    emaildata = emaildata.replace(
      "<$_StudentCode>",
      sessionStorage.getItem("token")
    );
    emaildata = emaildata.replace(
      "<$_StudentOrderId>",
      sessionStorage.getItem("bookingId")
    );
    emaildata = emaildata.replace(
      "$_Paymenturl",
      creds.paymenturl + data.strSessionID
    );
    emaildata = emaildata.replace(
      "[Paymenturl]",
      creds.paymenturl + data.strSessionID
    );
    emaildata = emaildata.replace(
      "<$_loginToken>",
      `https://localhost:3000/login/${sessionStorage.getItem("customerId")}`
    );

    // <![CDATA[<div>\r\n<img src="https://foto-select.herokuapp.com/images/Email_Image.png" width="180" height="70"/>\r\n</div>\r\n<br/>\r\n<div> Dear &nbsp; <cname> <$_Firstname> <$_Lastname>,\r\n<div>\r\n<br/>\r\n</div>\r\n<div>Congratulations !</div>\r\n<br/>\r\n<div>You have successfully created order with us. Your order details with us are as below. on &nbsp;<a href="https://foto-select.herokuapp.com/">https://foto-select.herokuapp.com/</a>\r\n</div>\r\n<div>\r\n<br/>\r\n</div>\r\n<div>\r\n<sname>Student Code :<span class="Apple-tab-span" style="white-space:pre"> </span><b><font color="red"><$_StudentCode></font>\r\n</b></sname>\r\n</div>\r\n<div><sname>Order Id :<span class="Apple-tab-span" style="white-space:pre"> </span><b><font color="red"><$_StudentOrderId></font></b></sname></div><div><br/></div><div><br/></div><div>click here to <$_loginToken> login</div><br><div>Thank you &nbsp;</div><div><font size="4" color="#660066"><b>Foto-Select</font></b></div></div>]]>

    var config = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: emaildata,
    };
    axios(config).then((res) => {
      console.log("this is the response", res);
    });
  }

  function sendsms() {
    const response2 = JSON.parse(sessionStorage.getItem("EmailSms"));
    const Emaildata = response2.data;

    if (Emaildata.SMS_Activation === "Always") {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      var body =
        data.strSessionID.length > 4
          ? Emaildata.Sms_messageforpayment
          : Emaildata.Sms_message;
      var smsdata =
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n  <SendSMS xmlns="http://tempuri.org/">\r\n <strPhoneNO>91' +
        userData.mobile +
        "</strPhoneNO>\r\n <strSMS>" +
        body +
        "</strSMS>\r\n </SendSMS>\r\n  </soap12:Body>\r\n</soap12:Envelope>";
      smsdata = smsdata.replace("<$_Firstname>", userData.firstName);
      smsdata = smsdata.replace("<$_Lastname>", userData.lastName);
      smsdata = smsdata.replace(
        "<$_StudentCode>",
        sessionStorage.getItem("token")
      );
      smsdata = smsdata.replace("<$_Sessionid>", data.strSessionID);
      smsdata = smsdata.replace(
        "<$_Paymenturl>",
        creds.paymenturl + data.strSessionID
      );
      smsdata = smsdata.replace(
        "<$_loginToken>",
        `http://localhost:3000/login?token=${sessionStorage.getItem("token")}`
      );

      var config = {
        method: "post",
        url: creds.serviceurl,
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
        },
        data: smsdata,
      };
      axios(config).then((res) => {
        console.log("this is the response", res);
      });
    }
  }

  const submitSelectedImages = () => {
    let reqData;
    let cid;
    let pid;
    const selectedImages = [];
    if (Number(imageSelectionNo) > 1) {
      const cData = selectedData.filter((e) => e.c)[0];
      const pData = selectedData.filter((e) => e.p)[0];
      selectedImages.push(cData);
      selectedImages.push(pData);
      cid = cData.id;
      pid = pData.id;
      reqData = `<?xml version="1.0" encoding="utf-8"?>\r\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n   <AddUserSelectedImages_DPC xmlns="http://tempuri.org/">\r\n      <strFkRegisterId>${data.strPkid}</strFkRegisterId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <strUserId>${customerId}</strUserId>\r\n      <listImageIds>\r\n        <string>${cid}</string>\r\n        <string>${pid}</string>\r\n      </listImageIds>\r\n      <nNoOfImages>${imageSelectionNo}</nNoOfImages>\r\n    </AddUserSelectedImages_DPC>\r\n  </soap:Body>\r\n</soap:Envelope>`;
    } else {
      const cData = selectedData.filter((e) => e.c)[0];
      selectedImages.push(cData);
      cid = cData.id;
      reqData = `<?xml version="1.0" encoding="utf-8"?>\r\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n   <AddUserSelectedImages_DPC xmlns="http://tempuri.org/">\r\n      <strFkRegisterId>${data.strPkid}</strFkRegisterId>\r\n      <strUserId>${customerId}</strUserId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <listImageIds>\r\n        <string>${cid}</string>\r\n      </listImageIds>\r\n      <nNoOfImages>${imageSelectionNo}</nNoOfImages>\r\n    </AddUserSelectedImages_DPC>\r\n  </soap:Body>\r\n</soap:Envelope>`;
    }
    console.log(selectedImages);
    sessionStorage.setItem("selectedImages", JSON.stringify(selectedImages));
    var config = {
      method: "post",
      url: creds.serviceurl,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      data: reqData,
    };
    axios(config)
      .then(function (response) {
        sendemail();
        sendsms();
        console.log(JSON.stringify(response.data));
        if (data.strSessionID.length > 4) {
          setRedirect(true);
        } else {
          setRedirect1(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onCClick = (index) => {
    const data = [...selectedData];
    data.forEach((e, i) => {
      if (i === index) {
        e.c = true;
      } else {
        e.c = false;
      }
    });
    setSelectedData(data);
    if (imageSelectionNo > 1) {
      const _sData = selectedData.filter((e) => e.p);
      if (_sData.length > 0) setIsDisabled(false);
      else setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  const onPClick = (index) => {
    const data = [...selectedData];
    data.forEach((e, i) => {
      if (i === index) {
        e.p = true;
      } else {
        e.p = false;
      }
    });
    setSelectedData(data);
    const _sData = selectedData.filter((e) => e.c);
    if (_sData.length > 0) setIsDisabled(false);
    else setIsDisabled(true);
  };

  const showInfo = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    if (selectedData !== null) {
      if (selectedData.length === 1) {
        setonlyOne(true);
      }
    }
  }, [selectedData]);
  return (
    <div className="selected_container">
      {redirect && <Redirect to="/forward" />}
      {redirect1 && <Redirect to="/completed" />}
      <div className="head">
        <Link to="/favourites">
          <span className="back">
            <i className="fas fa-chevron-left"></i>&nbsp;Back
          </span>
        </Link>
        <h5>Finalize Your Selection</h5>
        <div></div>
        <div className="info" onClick={() => showInfo()}>
          <span>?</span>
        </div>
      </div>
      <div className="body">
        <div className="images_cont" style={{ marginBottom: "50px" }}>
          {selectedData.map((e, i) => (
            <div
              key={e.name}
              className={`${
                onlyOne ? "image  image_one" : `image  customimage_${i}`
              }`}
            >
              <div className='photo_sel'>
                <img
                className="raw_img_sel"
                  src={"data:image/jpeg;base64," + e.image}
                  alt="Photography"
                />
                 <div className='frontcopyright_sel' >
                    <img src='./images/water_mark.png' className='frontcopyright_img_sel' />
                  </div>
              </div>
              <p>{e.id}</p>
              <div
                className={e.c ? "comp_port active" : "comp_port"}
                onClick={() => {
                  onCClick(i);
                }}
              >
                <span className="boldfont">C</span>
              </div>
              {Number(imageSelectionNo) > 1 && (
                <div
                  className={
                    e.p ? "comp_port reverse active" : "comp_port reverse"
                  }
                  onClick={() => {
                    onPClick(i);
                  }}
                >
                  <span className="boldfont">P</span>
                </div>
              )}
              <span className="add" onClick={() =>{
                setIsCarouselOpen(true);
                
                selectedSlide(i);

              } }>
                <i className="fas fa-plus"></i>
              </span>
            </div>
          ))}
        </div>
        <br />
        <button onClick={() => submitSelectedImages()} disabled={isDisabled}>
          Continue&nbsp;<i className="fas fa-chevron-right"></i>
          <i className="fas fa-chevron-right"></i>
        </button>
        {/* <Link to="/forward">
        </Link> */}
        {/* <p style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
          Click here to simulate payment <br /> flag set
        </p> */}
        <Dialog
          className="dialog select widthmax"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="dialog_cont">
            <div className="close" onClick={() => setIsOpen(false)}>
              <span>X</span>
            </div>
            <h5 className="boldfont" style={{ paddingTop: "25px" }}>
              Selecting Poses
            </h5>
            {Number(imageSelectionNo) > 1 && (
              <p style={{ margin: "auto 10%" }}>
                Select the pose you want for your{" "}
                <strong className="boldfont">Portait</strong> and{" "}
                <strong className="boldfont">Composite</strong> using the
                button.
              </p>
            )}
            {Number(imageSelectionNo) === 1 && (
              <p style={{ margin: "auto 10%" }}>
                Select the pose you want for your{" "}
                <strong className="boldfont">Composite</strong> using the
                button.
              </p>
            )}
            <div className="com_por">
              <div className="com">
                <p className="letter boldfont">C</p>
                <h6>Composite</h6>
                <p className="desc">Appears on group composite</p>
              </div>
              {Number(imageSelectionNo) > 1 && (
                <div className="por">
                  <p className="letter boldfont">P</p>
                  <h6>Portrait</h6>
                  <p className="desc">Available online for ordering</p>
                </div>
              )}
            </div>
          </div>
        </Dialog>
        <Dialog
          className="dialog carousel"
          open={isCarouselOpen}
          onClose={() => setIsCarouselOpen(false)}
        >
          <div className="dialog_conta">
            <span
              onClick={() => setIsCarouselOpen(false)}
              style={{
                zIndex: 1,
                height: "24px",
                background: "#fff",
                borderRadius: "50%",
              }}
            >
              <i className="far fa-times-circle"></i>
            </span>
            <Slider
              ref={(slider) => {
                setPresetslide(slider);
              }}
              {...settings}
            >
              {selectedData.map((e, i) => (
                <div className="image" key="e.id">
                  <div className="photo full">
                    <img
                      src={"data:image/jpeg;base64," + e.image}
                      alt="Photography"
                    />
                  </div>
                  <p>{e.id}</p>
                  <div
                    className={e.c ? "comp_port active" : "comp_port"}
                    onClick={() => {
                      onCClick(i);
                    }}
                  >
                    <span className="letter boldfont">C</span>
                  </div>
                  {Number(imageSelectionNo) > 1 && (
                    <div
                      className={
                        e.p ? "comp_port reverse active" : "comp_port reverse"
                      }
                      onClick={() => {
                        onPClick(i);
                      }}
                    >
                      <span className="letter boldfont">P</span>
                    </div>
                  )}
                  {/* <span className="add" onClick={() => setIsCarouselOpen(true)}>
                    <i className="fas fa-plus"></i>
                  </span> */}
                   <div className='frontcopyright_sele2' >
                    <img src='./images/water_mark.png'  />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Selected;
