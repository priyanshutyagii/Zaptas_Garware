import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "auto", // Adjust height to auto
        flexDirection: "column",
        padding: "20px", // Add some padding for spacing
      }}
    >
      <ClipLoader color="#3498db" size={100} />
      <div
        style={{
          textAlign: "center",
          color: "#333",
          fontFamily: "Arial, sans-serif",
          marginTop: "20px", // Space between loader and text
        }}
      >
        <h4>Did You Know?</h4>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li>
            Garware Hi-Tech Films is a leading manufacturer of polymer films,
            offering innovative solutions for packaging, automotive, and other
            industries.
          </li>
          <li>
            The company has over 40 years of experience in the field and is
            recognized for its state-of-the-art manufacturing technology.
          </li>
          <li>Garware Hi-Tech Films exports its products to over 80 countries worldwide.</li>
          <li>
            The company is committed to sustainability, with a strong focus on
            eco-friendly products and processes.
          </li>
          <li>
            It has a diverse range of products, including BOPP films, which are
            widely used for packaging food, textiles, and more.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Loader;
