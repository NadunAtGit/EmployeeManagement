import React, { useState, useRef, useEffect } from "react";
import { FaRegFileImage } from "react-icons/fa6";
import { MdOutlineDelete } from "react-icons/md";

const ImageSelector = ({ image, setImage ,handleDeleting}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    handleDeleting();
  };

  useEffect(() => {
    if (typeof image === "string") {
      // If `image` is a URL string, use it as the preview URL
      setPreviewUrl(image);
    } else if (image instanceof File) {
      // If `image` is a File object, create a temporary URL
      const fileUrl = URL.createObjectURL(image);
      setPreviewUrl(fileUrl);

      // Cleanup the URL when the component unmounts or `image` changes
      return () => URL.revokeObjectURL(fileUrl);
    } else {
      // Reset preview if `image` is null or undefined
      setPreviewUrl(null);
    }
  }, [image]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Preview or upload button */}
      {previewUrl ? (
        <div className="relative w-full flex justify-center">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-30 h-30 object-cover rounded-full shadow-md"
          />
          <button
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-red-500 hover:text-white"
            onClick={handleRemoveImage}
            aria-label="Remove Image"
          >
            <MdOutlineDelete className="text-xl" />
          </button>
        </div>
      ) : (
        <button
          className="flex flex-col items-center gap-2 p-4 border-dashed border-2 border-cyan-500 rounded-full hover:bg-cyan-50 w-30 h-30"
          onClick={onChooseFile}
          aria-label="Upload Image"
        >
          <FaRegFileImage className="text-3xl text-cyan-500" />
          <p className="text-sm text-slate-500">Browse image files to upload</p>
        </button>
      )}
    </div>
  );
};

export default ImageSelector;
