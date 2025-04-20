import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function EyePassword({ showPassword, toggleShowPassword }) {
  return (
    <button className="eyePassword"
      type="button"
      onClick={toggleShowPassword}
      aria-label={showPassword ? "Hide password" : "Show password"}
      >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  );
}
