/* eslint-disable */
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './forwardToPayment.css';
import xml2js from 'xml2js';
import axios from 'axios';
import creds from '../../utils/Config.json';

const ForwardToPayment = ({ data }) => {
  const [imageSelectionNo, setImageSelectionNo] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  

  const customerId = sessionStorage.getItem('customerId');
  const bookingId = sessionStorage.getItem('strBookingPkid');
  var reqData = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n    <GetSuppliersPS xmlns="http://tempuri.org/">\r\n      <strCustomerId>${customerId}</strCustomerId>\r\n      <strFkBookingId>${bookingId}</strFkBookingId>\r\n    </GetSuppliersPS>\r\n  </soap:Body>\r\n</soap:Envelope>`;
  var config = {
    method: 'post',
    url: creds.serviceurl,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
    },
    data: reqData,
  };

  var idata = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n    <GetUserSelectedImage_DPC xmlns="http://tempuri.org/">\r\n      <strFkRegisterId>${data.strPkid}</strFkRegisterId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <strUserId>${customerId}</strUserId>\r\n    </GetUserSelectedImage_DPC>\r\n  </soap:Body>\r\n</soap:Envelope>`;
  var iconfig = {
    method: 'post',
    url: creds.serviceurl,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
    },
    data: idata,
  };

  useEffect(() => {
    const _selectedImages = JSON.parse(
      sessionStorage.getItem('selectedImages')
    );
    setSelectedImages(_selectedImages);
    axios(config)
      .then(function (response) {
        const str = response.data
          .split(
            // eslint-disable-next-line no-useless-escape
            `<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><soap:Body><GetSuppliersPSResponse xmlns=\"http://tempuri.org/\">`
          )[1]
          .split('</GetSuppliersPSResponse>')[0];
        const parser = new xml2js.Parser();
        parser.parseString(String(str), function (err, result) {
          console.log(result.GetSuppliersPSResult.nRawImageSelectionNo[0]);
          setImageSelectionNo(
            result.GetSuppliersPSResult.nRawImageSelectionNo[0]
          );
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios(iconfig)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='forward_container'>
      <div className='head'>
        <Link to='/selected'>
          <span>
            <i className='fas fa-chevron-left'></i>&nbsp;Back
          </span>
        </Link>
        <h5>Great Job!</h5>
        <div style={{ width: '95px' }}></div>
      </div>
      <div className='body'>
        <h6>Your sitting fee is required</h6>
        <br />
        <p style={{ fontSize: '22px' }} className='paymentmsgmobile'>
          Payment is due today! Late payments will incur extra fees.
        </p>
        {/* <Link to="/completed"> */}
        <a href={creds.paymenturl + data.strSessionID}>
          <button>Proceed to Payment</button>
        </a>
        {/* </Link> */}
        <div className='cp_container'>
          <div  className={`comp  customimage_0`}>
            <div className='details rightmargin'>
              <div
                className='content'
                style={{ background: 'white', maxWidth: '225px' }}
              >
                Your chosen <br />
                <span style={{ color: '#82ca78' }}>composite pose</span> will
                appear on the group composite.
              </div>
              <br />
              <img src='/images/arrow_green.svg' alt='arrow' />
            </div>
            <div className='image'>
              {selectedImages.length ? (
                <img
                  src={'data:image/jpeg;base64,' + selectedImages[0]?.image}
                  alt='Photography'
                  className='this_finalimage'
                />
              ) : (
                <img src='' alt='None' />
              )}
                { true && 
              <div className='frontcopyright_for' >
                    <img src='./images/water_mark.png' className='frontcopyright_img_for' />
                  </div>
               }
              <span className='boldfont'>C</span>
              <p>{selectedImages[0]?.id}</p>
            </div>
          </div>
          {Number(imageSelectionNo) > 1 && (
            <div className='port' className={`port  final_customimage_1`}>
              <div className='image'>
                {selectedImages.length ? (
                  <img
                    src={'data:image/jpeg;base64,' + selectedImages[1]?.image}
                    alt='Photography'
                    className='this_finalimage'
                  />
                  
                ) : (
                  <img src='' alt='None' />
                )}
                { true && 
                 <div className='frontcopyright_for' >
                    <img src='./images/water_mark.png' className='frontcopyright_img_for' />
                  </div>
                 }
                <span className='boldfont'>P</span>
                <p>{selectedImages[1]?.id}</p>
              </div>
              <div className='details leftmargin'>
                <img
                  src='/images/arrow_blue.svg'
                  alt='arrow'
                  style={{ alignSelf: 'flex-start', height: '110px' }}
                />
                <br />
                <div
                  className='content anothe_last'
                  style={{ background: 'white', maxWidth: '225px' }}
                >
                  In 2-4 weeks you’ll receive an e-mail to order your chosen
                  <wbr></wbr>
                  <span style={{ color: '#7cbddd' }}>portrait pose</span>{' '}
                  online.
                </div>
              </div>
            </div>
          )}
        </div>
        <p style={{ fontSize: '22px' }} className='paymentmsg'>
          Payment is due today! Late payments wil incur extra fees.
        </p>
        <div className='cropping cropping1 bottommargin'>
          <div className='img'>
            <img src='/images/camera.png' alt='camera' />
          </div>
          <div className='details width25'>
            <h6>We will take it from here</h6>
            <p style={{ textAlign: 'center' }}>
              Our expert team will get to work retouching and color correcting
              your photo so you look your best.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForwardToPayment;
