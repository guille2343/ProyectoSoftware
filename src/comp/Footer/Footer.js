import React from "react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="column">
          <h3>Your Account</h3>
          <ul>
            <li>About Us</li>
            <li>Account</li>
            <li>Payment</li>
          </ul>
        </div>
        <div className="column">
          <h3>Products</h3>
          <ul>
            <li>Delivery</li>
            <li>Track Order</li>
            <li>New Product</li>
          </ul>
        </div>
        <div className="column">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <a
                href="https://www.facebook.com/share/16GWCuJukq/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook /> Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/flee_ked?igsh=MWowcXkzbWRxdzlnYw=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram /> Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@fleeked6?_t=ZS-8vLVdgso5sF&_r=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok /> TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
