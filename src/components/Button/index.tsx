import { ButtonHTMLAttributes } from "react";

import classNames from "classnames";

import "./styles.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  isDangerous?: boolean;
  isGrey?: boolean;
  ref?: string;
};

export function Button({isOutlined = false, isDangerous = false, isGrey = false, ...props}: ButtonProps) {
  return (
    <button 
      className={
        classNames( 
          "btn",
          {outlined: isOutlined},
          {dangerous: isDangerous},
          {grey: isGrey},
        )
      } 
      {...props} 
    />
  );
}