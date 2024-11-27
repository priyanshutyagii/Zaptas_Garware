// components/Loader.js
import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <ClipLoader color="#3498db" size={100} />
    </div>
  );
};

export default Loader;
