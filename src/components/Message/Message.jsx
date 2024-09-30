import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useRef } from "react";

const Message = ({ messages, user }) => {
  const messageRef = useRef(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  console.log(messages);

  return (
    <>
      {messages?.map((message, i) => (
        <div key={i} ref={messageRef}>
          {/* receiver message */}
          {message.receiverId === user.uid && (
            <>
              <div
                className="max-w-[80%] mr-auto py-3 grid place-items-start"
                key={i}
              >
                {message.type === "text" && (
                  <div className="bg-indigo-400 px-2 py-3 pb-6 rounded-md relative min-w-40">
                    <p className="text-white font-Inter text-sm font-light leading-relaxed">
                      {message.message}
                    </p>
                    <div className="absolute bottom-1 right-1">
                      <p className="text-white text-xs font-Inter font-extralight">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {/* image */}
                {message.type === "image" && (
                  <div className="max-w-[300px] mr-auto max-h-[300px] my-3 shadow">
                    <img
                      src={message.message}
                      className="w-full max-h-60 object-cover rounded"
                    />
                  </div>
                )}

                {message.type === "voice" && (
                  <div className="max-w-[300px] ml-automy-3">
                    <audio
                      src={message.message}
                      controls
                      className="shadow-md"
                    ></audio>
                  </div>
                )}
              </div>
            </>
          )}

          {/* sender message */}
          {message.senderId === user.uid && (
            <div className="max-w-[80%] ml-auto py-3 grid place-items-end">
              {message.type === "text" && (
                <div className="bg-blue-400 px-2 py-3 pb-6 rounded-md relative min-w-40">
                  <p className="text-white font-Inter text-sm font-light leading-relaxed">
                    {message.message}
                  </p>
                  <div className="absolute bottom-1 right-1">
                    <p className="text-white text-xs font-Inter font-extralight">
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              )}
              {/* image */}
              {message.type === "image" && (
                <div className="max-w-[300px] ml-auto max-h-[300px] my-3 shadow">
                  <img
                    src={message.message}
                    className="w-full max-h-60 object-cover rounded"
                  />
                </div>
              )}

              {message.type === "voice" && (
                <div className="max-w-[300px] ml-automy-3">
                  <audio
                    src={message.message}
                    controls
                    className="shadow-md"
                  ></audio>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Message;
