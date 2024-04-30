import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import hand_landmarker_task from './models/hand_landmarker.task';
import { useCursor } from './CursorContext';


const HandTrackingComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [handPresence, setHandPresence] = useState(null);
  const [gesture, setGesture] = useState(''); // To track the detected gesture
  //const { setCursorPosition } = useCursor();
  const { updateLandmarks } = useCursor();
  const modelRef = useRef(null);



  //const updateCursorPosition = (indexTip2) => {
    // Normalize the cursor position to a range of [0, 1]
    
  //  const normalizedX = 1000*indexTip2.x / videoRef.current.videoWidth;
  //  const normalizedY = 1000*indexTip2.y / videoRef.current.videoHeight;
  
    //console.log("Normalized cursor position:", indexTip2.x, indexTip2.y);
  
    // Now set this normalized position in your context or state
  //  setCursorPosition({ x: normalizedX, y: normalizedY });
  //};

  const handleLandmarkDetection = (detections) => {
    if (detections) {
      const newLandmarks = detections.map(landmark => ({
        x: 1000 * landmark.x / videoRef.current.videoWidth, // Assuming landmark contains x coordinate
        y: 1000 * landmark.y / videoRef.current.videoHeight, // Assuming landmark contains y coordinate
        z:  0 // include z if you want
      }));
      updateLandmarks(newLandmarks)
    }
  };



  useEffect(() => {
    let handLandmarker;
    let animationFrameId;

    const initializeHandDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: hand_landmarker_task },
          numHands: 2,
          runningMode: 'video',
        });
        detectHands(); // Start detection once initialized
      } catch (error) {
        console.error('Error initializing hand detection:', error);
      }
    };

    const detectGesture = (landmarks) => {
      if (!landmarks || landmarks.length === 0) return '';

        

      const indexTip = landmarks[8].y;
      const middleTip = landmarks[12].y;
      const ringTip = landmarks[16].y;
      const littleTip = landmarks[20].y;
      const thumbTip = landmarks[4].y;


      const indexTip2 = landmarks[8];  //KEEP THIS
     

      if (!indexTip2|| indexTip2.x === undefined || indexTip2.y === undefined) {
        console.log("Invalid indexTip data:", indexTip2);
        return 'Unknown';
        
      }


      



      handleLandmarkDetection(landmarks)


      // Detect pointing (index finger up, others down)
      const isPointing = 
        indexTip < middleTip &&
        indexTip < ringTip &&
        indexTip < littleTip;

      //if (isPointing) {
        //updateCursorPosition(indexTip2);  // Update position only if pointing
        ////setGesture('Pointing');
      //  } else {
      //  setGesture('Unknown');  // Update gesture state accordingly
      //  }
        
      if (isPointing) return 'Pointing';
            // Detect open hand (all fingers up)

      const isOpenHand = 
        indexTip < landmarks[5].y &&
        middleTip < landmarks[9].y &&
        ringTip < landmarks[13].y &&
        littleTip < landmarks[17].y;

      if (isOpenHand) return 'Open Hand';

      // Detect closed hand (all fingers closed)
      const isClosedHand = 
        indexTip > landmarks[5].y &&
        middleTip > landmarks[9].y &&
        ringTip > landmarks[13].y &&
        littleTip > landmarks[17].y;

      if (isClosedHand) return 'Closed Hand';

      return 'Unknown';
    };



    const detectHands = () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        const detections = handLandmarker.detectForVideo(videoRef.current, performance.now());

        setHandPresence(detections.handednesses.length > 0);

        if (detections.landmarks) {
          const gesture = detectGesture(detections.landmarks[0]);
          setGesture(gesture); // Set the detected gesture

          // Draw landmarks
          drawLandmarks(detections.landmarks);
        }
      }
      animationFrameId = requestAnimationFrame(detectHands); // Keep detecting
    };

    const drawLandmarks = (landmarksArray) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';

      landmarksArray.forEach((landmarks) => {
        landmarks.forEach((landmark) => {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw a circle for each landmark
          ctx.fill();
        });
      });
    };

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        initializeHandDetection();
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    startWebcam();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <>
      <h1>Is there a Hand? {handPresence ? 'Yes' : 'No'}</h1>
      <h2>Detected Gesture: {gesture}</h2>
      <div style={{ position: 'relative' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '640px', height: '480px' }} />
        <canvas ref={canvasRef} style={{ backgroundColor: 'black', width: '640px', height: '480px' }} />
      </div>
    </>
  );
};

export default HandTrackingComponent;
