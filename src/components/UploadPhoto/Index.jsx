import "cropperjs/dist/cropper.css";
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as Ref,
  uploadString,
} from "firebase/storage";
import React, { createRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "./../../feature/UserSlice";
import { Icons } from "./../../icons/Index";
import Modal from "./../Modal/Index";
import ImageCropper from "./ImageCropper";

function UploadPhoto({ showModal, setShowModal, fileRef }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const auth = getAuth();

  const storage = getStorage();

  const db = getDatabase();

  const [showCropper, setShowCropper] = useState(false);
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
    setShowCropper(true);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
    }
    setShowCropper(false);
  };

  const uploadProfilePhoto = () => {
    if (user?.photoURL) {
      deleteObject(Ref(storage, user?.photoURL));
    }

    const fileName = `${user.uid}-${Date.now()}`;

    const storageRef = Ref(storage, `profile/${fileName}`);

    // Data URL string
    const message4 = cropData;
    uploadString(storageRef, message4, "data_url").then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        update(ref(db, "users/" + user.uid), {
          photoURL: downloadURL,
        }).then(() => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            dispatch(setUser({ ...user, photoURL: downloadURL }));
          });
        });
      });
    });

    toast.success("Profile photo uploaded successfully");
    setShowModal(false);
  };

  return (
    <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
      <div className="w-[600px] bg-white shadow-md rounded-md px-2">
        <h2 className="text-lg font-semibold text-center px-2 py-2">
          Upload Photo
        </h2>
        {!showCropper ? (
          <>
            <div
              className="flex items-center justify-center flex-col min-h-[300px] bg-slate-200 border-2 border-dashed border-sky-700 mb-3 cursor-pointer px-2 relative rounded"
              onClick={() => fileRef.current.click()}
            >
              {cropData !== "#" ? (
                <>
                  <img
                    src={cropData}
                    alt="profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <h4 className="text-center">Click to change</h4>
                </>
              ) : (
                <div className="bg-sky-500 text-white text-sm rounded-md px-4 py-2 flex items-center gap-x-2">
                  <Icons.Gallery />
                  <h4>Upload Your profile photo</h4>
                </div>
              )}
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={onChange}
              />
            </div>

            {cropData !== "#" ? (
              <button
                className="w-full px-2 py-2 my-2 bg-sky-500 text-white rounded-md"
                onClick={uploadProfilePhoto}
              >
                Upload
              </button>
            ) : null}
          </>
        ) : (
          <ImageCropper
            image={image}
            getCropData={getCropData}
            cropperRef={cropperRef}
          />
        )}
      </div>
    </Modal>
  );
}

export default UploadPhoto;
