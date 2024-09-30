import { getDatabase, push, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as Ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";
import { useAudioRecorder } from "react-audio-voice-recorder";
import {
  FaArrowRight,
  FaPause,
  FaPauseCircle,
  FaPlay,
  FaPlayCircle,
  FaRedoAlt,
  FaStopCircle,
} from "react-icons/fa";

const VoiceRecorder = ({ showRecorder, setShowRecorder, user, singleUser }) => {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder();

  const [blob, setBlob] = useState(null);
  const [recording, setRecording] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [recordsTime, setRecordsTime] = useState(0);
  const [duration, setDuration] = useState("00:00");
  const storage = getStorage();
  const db = getDatabase();
  const playerRef = useRef(null);

  // restart recording
  const handleVoiceReset = () => {
    setAudioUrl("");
    setDuration(0);
    setRecordsTime(0);
    setBlob(null);
    setRecording(true);
    startRecording();
  };

  // handle play pause in recorded audio
  const handlePlayPause = () => {
    if (playerRef.current.paused) {
      setIsPlaying(true);
      playerRef.current.play();
      playerRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        playerRef.current.currentTime = 0;
        setCurrentTime(0);
      });
      playerRef.current.addEventListener("timeupdate", (e) => {
        // setCurrentTime(playerRef.current.currentTime)
        let currentTimes = playerRef.current.currentTime;
        setCurrentTime(currentTimes);
        // convert current time in minutes
        let minutes = Math.floor(currentTimes / 60);
        let seconds = Math.floor(currentTimes % 60);
        if (seconds < 10) seconds = `0${seconds}`;
        if (minutes < 10) minutes = `0${minutes}`;
        setDuration(`${minutes}:${seconds}`);
      });
    } else {
      setIsPlaying(false);
      playerRef.current.pause();
    }
  };

  const handleSendVoice = () => {
    uploadBytes(Ref(storage, `audio/${new Date().getTime()}.mp3`), blob).then(
      (res) => {
        getDownloadURL(res.ref).then((url) => {
          set(push(ref(db, "messages")), {
            senderId: user.uid,
            receiverId: singleUser.uid,
            message: url,
            type: "voice",
          }).then(() => {
            setRecording(false);
            setShowRecorder(false);
            setAudioUrl("");
            setDuration(0);
            setRecordsTime(0);
            setBlob(null);
          });
        });
      }
    );
  };

  useEffect(() => {
    if (!showRecorder) return;
    setRecording(true);
    startRecording();
  }, [showRecorder]);

  // audio blob
  useEffect(() => {
    setBlob(null);
    if (!recordingBlob) return;
    setBlob(recordingBlob);
    let url = URL.createObjectURL(recordingBlob);
    if (url) setAudioUrl(url);
  }, [recordingBlob]);

  // convert recording time to minutes
  useEffect(() => {
    if (!recordingTime) return;

    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;

    let min = 0;
    let sec = 0;

    if (minutes < 10) {
      min = `0${minutes}`;
    } else {
      min = minutes;
    }

    if (seconds < 10) {
      sec = `0${seconds}`;
    } else {
      sec = seconds;
    }
    setRecordsTime(`${min}:${sec}`);
  }, [recordingTime]);

  return (
    <>
      {mediaRecorder && (
        <div className="w-full h-full flex justify-center items-center gap-x-2 px-2 overflow-hidden">
          <div
            className="bg-sky-500 p-1 rounded-full cursor-pointer text-white"
            onClick={() => togglePauseResume()}
          >
            {!isPaused && <FaPauseCircle size={20} />}
            {isPaused && <FaPlayCircle size={20} />}
          </div>
          <div className="text-gray-500 text-sm">{recordsTime}</div>
          <div>
            <LiveAudioVisualizer
              mediaRecorder={mediaRecorder}
              barColor="#5E3493"
              smoothingTimeConstant={0.5}
              barWidth={2}
            />
          </div>
          <button
            className="bg-sky-500 text-white p-1 rounded-md"
            onClick={stopRecording}
          >
            <FaStopCircle size={20} />
          </button>
        </div>
      )}
      {/* play voice after close the recorder */}
      {!isRecording && blob && (
        <>
          <div className="bg-[#F5F5F5] px-2 py-4 flex justify-center items-center gap-x-3">
            <div className="bg-sky-500 p-2 rounded-full cursor-pointer text-white">
              {isPlaying ? (
                <span onClick={handlePlayPause}>
                  <FaPause />
                </span>
              ) : (
                <span onClick={handlePlayPause}>
                  <FaPlay />
                </span>
              )}
            </div>
            <div>{duration}</div>
            <div>
              <AudioVisualizer
                blob={blob}
                width={300}
                height={75}
                barWidth={1}
                barColor={"red"}
                currentTime={currentTime}
                barPlayedColor={"green"}
              />
              <audio src={audioUrl} ref={playerRef} hidden></audio>
            </div>
            <div className="flex items-center justify-center gap-x-2">
              {/* restart voice reorder */}
              <button
                className="bg-sky-500 p-2 rounded-full cursor-pointer text-white"
                onClick={handleVoiceReset}
              >
                <FaRedoAlt />
              </button>
              {/* send button */}
              <button
                className="bg-sky-500 p-2 rounded-full cursor-pointer text-white"
                onClick={handleSendVoice}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default VoiceRecorder;
