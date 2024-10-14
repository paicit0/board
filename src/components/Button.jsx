import React from "react";

const Button = (props) => {
  return (
    <button className={props.className} onClick={props.handle}>{props.content}</button>
  );
};

export default Button;
