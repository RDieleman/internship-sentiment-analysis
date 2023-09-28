import { useEffect, useState } from "react";
import "./Style.css";

const ImageContainer = ({ src, alt = "image", className, ...props }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const imageToLoad = new Image();
    imageToLoad.src = src;
    imageToLoad.onload = () => {
      setLoading(false);
    };
  }, [src]);

  return (
    <div
      className={`${className ? className : ""} image-container ${
        loading ? "image-loading " : ""
      }`}
      {...props}
    >
      {!loading && <img src={src} alt={alt} />}
    </div>
  );
};

export default ImageContainer;
