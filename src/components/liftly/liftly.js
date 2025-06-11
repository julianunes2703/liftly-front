import React from "react";
import "./liftly.css";

function LogoLiftly({ color = "#4CAF84" }) {
  return (
    <div className="logo-liftly">
      <a href="/" className="logo-text" style={{color, fontWeight: "bold"}}>Liftly</a>
    </div>
  );
}

export default LogoLiftly;
