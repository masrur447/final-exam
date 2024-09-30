import React from "react";
import { Helmet } from "react-helmet-async";
import Friends from "./../components/Friends/Index.jsx";
import Message from "./../components/Message/Index.jsx";

const Messages = () => {
  return (
    <>
      <Helmet>
        <title>Messages</title>
      </Helmet>
      <div className="grid grid-cols-3 gap-x-3 px-3 py-4">
        <div className="col-span-1">
          <div className="shadow-lg rounded-md p-4">
            <Friends />
          </div>
        </div>
        <div className="col-span-2">
          <Message />
        </div>
      </div>
    </>
  );
};

export default Messages;
