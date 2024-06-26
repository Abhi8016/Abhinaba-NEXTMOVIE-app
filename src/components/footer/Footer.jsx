import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import ContentWrapper from "../contentWrapper/ContentWrapper";

import "./style.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <ContentWrapper>
        <ul className="menuItems">
          <li className="menuItem">Terms Of Use</li>
          <li className="menuItem">Privacy-Policy</li>
          <li className="menuItem">About</li>
          <li className="menuItem">Blog</li>
          <li className="menuItem">FAQ</li>
        </ul>
        <div className="infoText">
          Hello! I'm Abhinaba Roy Choudhury, an enthusiastic Frontend React
          Developer. If you're reading this, you've likely explored the app, and
          I hope you found it enjoyable. If you have any suggestions for
          improvement or have identified any bugs, please feel free to connect
          with me on{" "}
          {
            <a
              target="_blank"
              href="https://www.linkedin.com/in/abhinaba-roy-choudhury-a9b889251/"
            >
              LinkedIn
            </a>
          }
          . Your feedback is greatly appreciated!
        </div>
        <div className="socialIcons">
          <span className="icon">
            <FaFacebookF />
          </span>
          <span className="icon">
            <FaInstagram />
          </span>
          <span className="icon">
            {/* < /> */}
            <FaXTwitter />
          </span>
          <span className="icon">
            <a
              target="_blank"
              href="https://www.linkedin.com/in/abhinaba-roy-choudhury-a9b889251/"
            >
              <FaLinkedin />
            </a>
          </span>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
