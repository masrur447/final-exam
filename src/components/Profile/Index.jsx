import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { Icons } from "./../../icons/Index";
import UploadPhoto from "./../UploadPhoto/Index";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef(null);
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="w-[106px] h-[106px] rounded-full bg-[#00000080] overflow-hidden relative">
          {/* avatar */}
          <img
            src={user?.photoURL || "https://i.pravatar.cc/106/106"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45 flex justify-center items-center">
            <button
              className="text-white outline-none"
              onClick={() => setShowModal(true)}
            >
              <Icons.ProfileUpload />
            </button>
          </div>
        </div>
        <p className="text-white">{user?.displayName}</p>
      </div>
      {showModal &&
        createPortal(
          <div>
            <UploadPhoto
              showModal={showModal}
              setShowModal={setShowModal}
              fileRef={fileRef}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default Profile;
