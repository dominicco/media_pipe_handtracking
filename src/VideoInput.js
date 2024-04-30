import React, { useRef, useEffect } from 'react';

const VideoInput = ({ onFrame }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      });

    return () => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return <video ref={videoRef} width={640} height={480} onPlay={onFrame} />;
};

export default VideoInput;
