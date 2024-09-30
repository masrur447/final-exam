import EmojiPicker from "emoji-picker-react";
import {
  getDatabase,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as Ref,
  uploadString,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Icons } from "./../../icons/Index";
import Message from "./Message";
import VoiceRecorder from "./VoiceRecorder";

const Messages = () => {
  const user = useSelector((state) => state.user.user);
  const singleUser = useSelector((state) => state.singleUser.user);
  const [showEmoji, setShowEmoji] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const db = getDatabase();
  const storage = getStorage();

  const handleEmoji = ({ emoji }) => {
    // Insert the emoji at the cursor position
    const ref = inputRef.current;
    const start = ref.selectionStart;
    const end = ref.selectionEnd;
    setInput(ref.value.substring(0, start) + emoji + ref.value.substring(end));
    ref.focus();

    // Hide the emoji picker
    setShowEmoji(false);
  };

  const handleSubmit = () => {
    if (input === "") return;
    set(push(ref(db, "messages")), {
      senderId: user.uid,
      receiverId: singleUser.uid,
      message: input,
      type: "text",
      createdAt: serverTimestamp(),
    }).then(() => {
      setInput("");
    });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitImage = () => {
    if (image) {
      const fileName = `images/${Date.now()}`;
      const storageRef = Ref(storage, fileName + ".jpeg");
      uploadString(storageRef, image, "data_url").then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          set(push(ref(db, "messages")), {
            senderId: user.uid,
            receiverId: singleUser.uid,
            message: url,
            type: "image",
            createdAt: serverTimestamp(),
          }).then(() => {
            setImage(null);
          });
        });
      });
    }
  };

  // get all messagea
  useEffect(() => {
    if (!user || !singleUser) return;
    onValue(ref(db, "messages"), (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        if (
          (doc.val().senderId === user.uid &&
            doc.val().receiverId === singleUser.uid) ||
          (doc.val().senderId === singleUser.uid &&
            doc.val().receiverId === user.uid)
        ) {
          messages.push({ ...doc.val(), id: doc.key });
        }
      });

      setMessages(messages);
    });
  }, [db, singleUser?.uid, user?.uid]);

  // paste image from clipboard on press ctrl + v
  useEffect(() => {
    const handlePaste = (event) => {
      event.preventDefault();
      // check input in focused or not
      if (!inputRef.current || inputRef.current !== document.activeElement)
        return;

      const items = event.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            setImage(event.target.result);
          };
          reader.readAsDataURL(blob);
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  if (singleUser !== null)
    return (
      <div className="bg-red-400 shadow-lg rounded-md h-full overflow-hidden relative">
        <div className="h-24 w-full bg-gray-200 rounded-ss-md">
          <div className="flex items-center gap-x-3 px-2 py-3">
            <div className="w-16 h-16 bg-slate-600 rounded-full overflow-hidden">
              <img
                src={singleUser.photoURL || "https://i.pravatar.cc/300"}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-black font-Inter font-medium">
              {singleUser.name}
            </p>
          </div>
        </div>
        {/* message */}
        <div className="bg-slate-50 h-[80vh] overflow-y-auto pb-5">
          <Message messages={messages} singleUser={singleUser} user={user} />
        </div>

        {singleUser.blocked ? (
          <div className="absolute bottom-0 h-20 w-full bg-red-400">
            <div className="w-full flex items-center justify-center gap-x-3 px-2 py-3 absolute">
              <p className="text-white font-Inter font-medium text-xl">
                This conversion is unavailable.
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-0 h-20 w-full bg-gray-200">
            {!showRecorder && (
              <div className="w-full flex items-center gap-x-3 px-2 py-3 absolute">
                {/* icons */}
                <div className="flex justify-center items-center gap-x-3">
                  <button
                    className="outline-none"
                    onClick={() => setShowRecorder(true)}
                  >
                    <Icons.Microphone />
                  </button>
                  <button
                    className="outline-none"
                    onClick={() => setShowEmoji((prev) => !prev)}
                  >
                    <span>
                      <Icons.Smile />
                    </span>
                    <div className="absolute bottom-20 left-0">
                      {showEmoji && (
                        <span>
                          <EmojiPicker onEmojiClick={handleEmoji} />
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    className="outline-none"
                    onClick={() => fileRef.current.click()}
                  >
                    <Icons.Gallery />
                    <input
                      type="file"
                      ref={fileRef}
                      hidden
                      accept="image/*"
                      onChange={handleImage}
                    />
                  </button>
                </div>
                {/* input */}
                <div className="flex flex-1">
                  <input
                    type="text"
                    value={input}
                    onKeyUp={(e) => e.key === "Enter" && handleSubmit()}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    className="w-full px-2 py-3 rounded-md border border-gray-300 bg-transparent outline-none"
                    ref={inputRef}
                  />
                </div>
                {/* submit */}
                <button
                  className="outline-none text- font-medium bg-sky-400/75 text-white rounded-md px-4 py-2 hover:bg-sky-500 transition focus:border focus:border-sky-200"
                  onClick={handleSubmit}
                >
                  Send
                </button>
              </div>
            )}
            {showRecorder && (
              <VoiceRecorder
                showRecorder={showRecorder}
                setShowRecorder={setShowRecorder}
                user={user}
                singleUser={singleUser}
              />
            )}
          </div>
        )}

        {/* image upload preview */}
        {image && (
          <div className="max-w-[60%] h-auto bg-slate-200 absolute left-0 bottom-20 p-1 ">
            <div className="w-full h-full relative">
              <span
                onClick={() => setImage(null)}
                className="absolute top-0 right-0 bg-red-500 p-1 rounded-full text-white cursor-pointer text-sm"
              >
                {/* x svg */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
              <img
                src={image}
                className="w-full max-h-60 object-cover rounded"
              />
              <button
                className="text-white bg-sky-400/75 px-4 py-2 rounded-md mt-1"
                onClick={submitImage}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    );
  else
    return (
      <>
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-2xl font-Inter font-medium text-slate-600">
            Select a user to start messaging
          </p>
        </div>
      </>
    );
};

export default Messages;
