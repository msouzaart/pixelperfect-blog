
import React from "react";

export default function ForgetPassword({ onClick }) {
  return (

    <p style={{ marginTop: 12, textAlign: "center" }}>
      <button
        type="button"
        onClick={onClick}
        style={{
          background: "none",
          border: "none",
          color: "#007bff",
          cursor: "pointer",
        }}
      >
        Forget the password?
      </button>
    </p>
  );
}