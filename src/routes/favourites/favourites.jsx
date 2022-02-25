/* eslint-disable */
import { Dialog, Slide, useMediaQuery } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Slider from 'react-slick';
import xml2js from 'xml2js';
import './favourites.css';
import creds from '../../utils/Config.json';
import CircularProgress from '@material-ui/core/CircularProgress';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

function NextArrow(props) {
  const { className, style, onClick, currentSlide, slideCount } = props;
  if (currentSlide + 1 === slideCount) return null;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
    />
  );
}

const Favourites = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errRedirect, setErrRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onlyOne,setonlyOne] = useState(false);
  const [presentslide,setPresetslide] = useState(null);
  const [selectedsl,selectedSlide] = useState(0);
  
  /// Code added by gourab
  const [settings ,setsettings] = useState({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  });

  useEffect(()=>{
   if(presentslide!=null){
    presentslide.slickGoTo(selectedsl,false);
    }
  },[presentslide]);

  





  const matches = useMediaQuery('(max-width:420px)');
  useEffect(() => {
    const selecteddata = JSON.parse(sessionStorage.getItem('selectedData'));
    const customerId = sessionStorage.getItem('customerId');
    const bookingPath = sessionStorage.getItem('bookingPath');
    console.log('this is fav', selecteddata);
    

    const data = `<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\r\n  <soap12:Body>\r\n    <GetRawImagesPS xmlns="http://tempuri.org/">\r\n      <strCustomerId>${customerId}</strCustomerId>\r\n      <Username>${creds.username}</Username>\r\n      <Password>${creds.password}</Password>\r\n      <strBookingPath>${bookingPath}</strBookingPath>\r\n    </GetRawImagesPS>\r\n  </soap12:Body>\r\n</soap12:Envelope>`;
    const config = {
      method: 'post',
      url: creds.serviceurl,
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      data: data,
    };
    setIsLoading(true);
    axios(config)
      .then((res) => {
        console.log(res.data);
        const parser = new xml2js.Parser();
        const str = res.data
          .split('<GetRawImagesPSResponse xmlns="http://tempuri.org/">')[1]
          .split('</GetRawImagesPSResponse>')[0];
        parser.parseString(str, function (err, result) {
          const favourite = [];
          result.GetRawImagesPSResult.images[0].string.forEach((ele, i) => {
            console.log('this is i', i);
            console.log('this is ele', ele);
            if (typeof ele == 'string') {
              favourite[i] = { selected: false };
              favourite[i].image = ele;
            }
          });
          result.GetRawImagesPSResult.imagesId[0].string.forEach((ele, i) => {
            // console.log("this is ele",ele);
            // console.log("this is i",i);
            if (typeof ele == 'string') {
              favourite[i].id = ele;
            }
          });
          setIsLoading(false);
          if (favourite.length) {
            console.log('this is selected data ', selecteddata);
            if (selecteddata !== null) {
              favourite.forEach((fav) => {
                selecteddata.map((newone) => {
                  if (newone.id === fav.id) {
                    fav.selected = newone.selected;
                    fav.selected = newone.selected;
                    if (newone.selected === true) {
                      setIsDisabled(false);
                    }
                  }
                  return null;
                });
              });
            }
            setFavourites(favourite);
          } else {
            setErrRedirect(true);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
    console.log(favourites);
    setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    setTimeout(() => {
     setIsOpen(false);
    }, 3500);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (favourites !== null) {
      if (favourites.length === 1) {
        setonlyOne(true);
      }
    }
  }, [favourites]);

  
  return (
    <div className='favourites_container'>
      {redirect && <Redirect to='/selected' />}
      {errRedirect && <Redirect to='/error' />}
      <div className='head'>
        <Link to='/persional-info'>
          <span>
            <i className='fas fa-chevron-left'></i>&nbsp;Back
          </span>
        </Link>
        <h5>Select your Favourite pictures</h5>
        <div></div>
      </div>
      <div className='body'>
        <div className='images_cont'>
          {isLoading ? (
            <div className='circle-loader'>
              <CircularProgress size={60} />
            </div>
          ) : (
            favourites.map((e, i) => (
              <div key={i} className={`${onlyOne ?  'image  image_one':`image  customimage_${i}` }`} >
                
                <div className='photo_fav'>
                  <img
                  className='raw_img_fav'
                    src={'data:image/jpeg;base64,' + e.image}
                    alt='Photography'
                  />
                  <div className='frontcopyright' >
                    <img src='./images/water_mark.png'  className='frontcopyright_img'  />
                  </div>
                </div>
                {/* <img className="photo" src={e.img} /> */}
                <p>{e.id}</p>
                <span
                  onClick={() => {
                    const fav = [...favourites];
                    fav[i].selected = !fav[i].selected;
                    console.log('favourites', fav);
                    setFavourites(fav);
                    const _fav = favourites.filter((e) => e.selected);
                    if (_fav.length > 0) setIsDisabled(false);
                    else setIsDisabled(true);
                  }}
                >
                  {e.selected && (
                    <img
                      src='/images/heart_fill.svg'
                      width='30'
                      height='26'
                      alt='like'
                    />
                  )}
                  {!e.selected && (
                    <img
                      src='/images/heart.svg'
                      width='30'
                      height='26'
                      alt='like'
                    />
                  )}
                </span>
                <span className='add' onClick={() => {
                  
                  setIsCarouselOpen(true);

                  
                 /* if(presentslide!=null)
                  presentslide.slickGoTo(i);*/

                  // Code added by Gourab 

                  selectedSlide(i);
                  
                  
                  // Code added by Gourab
                  
                  }}>
                  <i className='fas fa-plus'></i>
                </span>
              </div>
            ))
          )}
        </div>
        <br />
        {!isLoading && (
          <button
            disabled={isDisabled}
            onClick={() => {
              const data = favourites.filter((e) => e.selected);
              sessionStorage.setItem('selectedData', JSON.stringify(data));
              setRedirect(true);
            }}
          >
            Continue&nbsp;<i className='fas fa-chevron-right'></i>
            <i className='fas fa-chevron-right'></i>
          </button>
        )}
        <div className='cropping' style={{ marginBottom: '65px' }}>
          <div className='img'>
            <img src='/images/cropping.png' alt='crop' />
          </div>
          <div className='details'>
            <h6>Cropping & Color correction</h6>
            <p>
              Your photo is color corrected, cropped and lightly retouched to
              ensure a consistent look for the composite.
            </p>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a onClick={() => setIsOpen(true)}>CLICK TO LEARN MORE</a>
          </div>
        </div>
        {matches ? (
          <Dialog
            className='dialog full_screen custom_style_mobile'
            fullScreen
            open={isOpen}
            onClose={() => setIsOpen(false)}
            TransitionComponent={Transition}
          >
            <div className='dialog_container'>
              <span onClick={() => setIsOpen(false)} style={{ zIndex: 1 }}>
                <i className='fas fa-times'></i>
              </span>
              <img
                className='systemimage'
                src='/images/dialog_content.png'
                alt='System'
              />
              <img
                className='mobileimage'
                src='/images/dialog_content1.png'
                alt='mobile'
              />
            </div>
          </Dialog>
        ) : (
          <Dialog
            className='dialog full_screen'
            fullScreen
            open={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <div className='dialog_container'>
              <span onClick={() => setIsOpen(false)} style={{ zIndex: 1 }}>
                <i className='fas fa-times'></i>
              </span>
              <img
                className='systemimage'
                src='/images/dialog_content.png'
                alt='System'
              />
              <img
                className='mobileimage'
                src='/images/dialog_content1.png'
                alt='mobile'
              />
            </div>
          </Dialog>
        )}
        <Dialog
          className='dialog carousel'
          open={isCarouselOpen}
          onClose={() => setIsCarouselOpen(false)}
        >
          <div className='dialog_container'>
            <span
              onClick={() => setIsCarouselOpen(false)}
              style={{
                zIndex: 1,
                height: '35px',
                background: '#fff',
                borderRadius: '50%',
              }}
            >
              <i className='far fa-times-circle'></i>
            </span>
            <Slider  ref={slider =>{

              setPresetslide(slider);

            }} {...settings}>
              {favourites.map((e, i) => (
                <div key={i} className='image'>
                  <div className='photo full'>
                    <img
                      src={'data:image/jpeg;base64,' + e.image}
                      alt='Phototgraphy'
                    />
                   
                  </div>
                  <p>{e.id}</p>
                  <span
                    onClick={() => {
                      const fav = [...favourites];
                      fav[i].selected = !fav[i].selected;
                      setFavourites(fav);
                      const _fav = favourites.filter((e) => e.selected);
                      if (_fav.length > 0) setIsDisabled(false);
                      else setIsDisabled(true);
                    }}
                  >
                    {e.selected && (
                      <img
                        src='/images/heart_fill.svg'
                        width='30'
                        height='26'
                        alt='like'
                        style={{ zIndex:99999}}
                      />
                    )}
                    {!e.selected && (
                      <img
                        src='/images/heart.svg'
                        width='30'
                        height='26'
                        alt='like'
                        style={{ zIndex:99999}}
                      />
                    )}
                  </span>
                  {/* <span className="add" onClick={() => setIsCarouselOpen(true)}>
                    <i className="fas fa-plus"></i>
                  </span> */}
                  <div className='frontcopyright2' >
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

export default Favourites;
