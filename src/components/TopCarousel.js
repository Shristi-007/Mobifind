import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './TopCarousel.css';
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import landing from "./img/landing.jpg";
import manufacturer from "./img/manufacturer.jpg";
import official from "./img/official.jpg"

const TopCarousel = () => {
  return (
    <div>
      <Carousel>
        <Carousel.Item >
          <img style={{height:'90vh'}}
            className="d-block w-100"
            src={landing}
            alt="First slide"
          />
          <Carousel.Caption style={{bottom:'-250px'}}>
            <h3 style={{ fontSize:'50px', fontFamily:'Arial',color:'black' ,fontWeight:'Bold'}}>Mobifind</h3>
            <h4 style={{fontWeight:'Bold',color:'orange',fontFamily: "Segoe UI"}}>A decentralised app for smartphone users to check/complain for lost/stolen mobiles.</h4>
            <div style={{ paddingBottom: '30%'}}></div>
          </Carousel.Caption>

        </Carousel.Item>

        <Carousel.Item >
          <img style={{height:'90vh'}}
            className="d-block w-100"
            src={manufacturer}
            alt="Second slide"
          />
          <Carousel.Caption style={{bottom:'-250px'}}>
          <h1 style={{marginBottom:"30px", color:'black', fontSize:'70px', fontFamily:'Arial',fontWeight:'Bold'}}>For Manufacturers</h1>
            <h5 style={{color:'black',fontWeight:'Bold'}}>Officially register your manufactured smartphone on the government record with ease.</h5>
            <Link to="/ManufacturerPage" className="btn btn-primary">
              Register as Manufacturer
            </Link>
            <div style={{ paddingBottom: '35%' }}></div>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item >
          <img style={{height:'90vh'}}
            className="d-block w-100"
            src={official}
            alt="Second slide"
          />
          <Carousel.Caption style={{bottom:'-250px'}}>
                <h1 style={{marginBottom:"30px", fontSize:'70px', fontFamily:'Arial',fontWeight:'Bold'}}>For Government Officials</h1>
                <h5 style ={{fontWeight:'Bold'}}>Verify manufacturer, distributer, retailer and user details involved in the smartphone supply chain.</h5>
                <Link to="/OfficialPage" className="btn btn-primary" style={{marginTop: "30px"}}>
              Register as official
            </Link>
            <div style={{ paddingBottom: '30%' }}></div>
          </Carousel.Caption>
        </Carousel.Item>

      </Carousel>
    </div>
  );

};

export default TopCarousel;