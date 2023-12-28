import React from "react";
import styles from "./mobileFooter.module.css";

function generateLink() {
  let number = "+2015515088";
  let message = "Hello,";
  let url = "https://wa.me/";
  return `${url}${number}?text=${message}`;
}

const MobileFooter = () => {
  return (
    <div className={`d-flex d-md-none ${styles["mobile-footer"]}`}>
      <button
        onClick={() => window.open("tel:+201111984555", "_parent")}
        style={{ backgroundColor: "#F13535" }}
      >
        أتصل
        <img
          src="/assets/images/media/mobileFooter/telephone.png"
          alt="call-icon"
          style={{
            width: "20px",
            height: "20px",
            marginRight: "5px",
            filter: "invert(100%)",
          }}
        />
      </button>
      <button
        onClick={() =>
          window.open(
            "mailto:ahmedkhaled4d@gmail.com?subject=subject&body=body"
          )
        }
        style={{ backgroundColor: "#F13535" }}
      >
        البريد
        <img
          src="/assets/images/media/mobileFooter/mail.png"
          alt="email-icon"
          id="container-icon"
          style={{
            width: "20px",
            height: "20px",
            marginRight: "5px",
            padingRight: "2px",
            filter: "invert(100%)",
          }}
        />
      </button>
      <button onClick={() => (window.location = generateLink())}>
        WhatsApp
        <img
          src="/assets/images/media/mobileFooter/whatsapp.png"
          alt="whatsapp-icon"
          style={{
            width: "20px",
            height: "20px",
            marginRight: "5px",
            filter: "invert(100%)",
          }}
        />
      </button>
      {/* <img
        src="assets/images/media/mobileFooter/close.png"
        alt="close icon"
        className={`${styles['close-icon']}`}
        onClick={() => {
          setMobileFooter(false);
        }}
      /> */}
    </div>
  );
};
export default MobileFooter;
