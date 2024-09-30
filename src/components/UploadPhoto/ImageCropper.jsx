import React from "react";
import { Cropper } from "react-cropper";

function ImageCropper({ image, cropperRef, getCropData }) {
  return (
    <div className="flex items-center justify-center flex-col min-h-[300px] h-auto bg-slate-200 border border-slate-700 mb-3 px-2">
      <div className="img-preview w-20 h-20 rounded-full overflow-hidden my-2 border border-slate-400" />
      <Cropper
        ref={cropperRef}
        zoomTo={0.5}
        initialAspectRatio={1}
        preview=".img-preview"
        src={image}
        viewMode={1}
        minCropBoxHeight={200}
        minCropBoxWidth={200}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        guides={true}
      />

      <button
        className="w-full px-2 py-2 my-2 bg-sky-500 text-white rounded-md"
        onClick={getCropData}
      >
        Crop Photo
      </button>
    </div>
  );
}

export default ImageCropper;
