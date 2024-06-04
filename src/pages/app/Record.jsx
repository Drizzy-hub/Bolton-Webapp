import { Box } from '@chakra-ui/react';
import { addDoc, doc, serverTimestamp } from '@firebase/firestore';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaRegCircleStop } from 'react-icons/fa6';
import { PiRecordFill } from 'react-icons/pi';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AuthenticatedUserContext } from '../../provider';

const Record = () => {
    const { user } = useContext(AuthenticatedUserContext);
    const [isRecording, setIsRecording] = useState(false);
    const [stream, setStream] = useState(null);
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const chunks = useRef([]);
  
    useEffect(() => {
      // Request access to the webcam
      const getMedia = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      };
      getMedia();
    }, []);
  
    const startRecording = () => {
      if (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (event) => {
          chunks.current.push(event.data);
        };
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks.current, { type: 'video/mp4' });
          chunks.current = [];
          await uploadVideo(blob);
        };
        mediaRecorder.start();
        setIsRecording(true);
      }
    };
  
    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    };
  
    const uploadVideo = async (blob) => {
      const timestamp = new Date().getTime(); // Generate a unique timestamp
      const filename = `video_${timestamp}.mp4`; // Construct filename with timestamp
      const path = `video/${user.uid}/${filename}`;
      const storageRef = ref(storage, path);
  
      try {
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
       
        await saveVideoURLToFirestore(downloadURL);
      } catch (error) {
        console.error("Error uploading video:", error);
        alert("Upload failed: " + error.message);
      }
    };
  
    const saveVideoURLToFirestore = async (url) => {
      try {
        await addDoc(doc(db, "posts"), {
          creator: user.uid,
          recordURL: url,
          creation: serverTimestamp(),
        });
        console.log("Video URL saved to Firestore");
      } catch (error) {
        console.error("Error saving video URL to Firestore:", error);
      }
    };
  
  return (
    <Box>
      <Box mt={{base:10}}>
        <video ref={videoRef} autoPlay muted style={{ width: '100%', maxHeight: '400px' }} />
      </Box>
      <Box display={'flex'} justifyContent={'center'} mt={{base:6}} alignItems={'center'} >
        {isRecording ? (
          <button onClick={stopRecording}><FaRegCircleStop size={50} /></button>
        ) : (
          <button onClick={startRecording}><PiRecordFill size={50} color='red'/></button>
        )}
      </Box>
    </Box>
  );
};

export default Record;
