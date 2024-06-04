import { Box } from '@chakra-ui/react';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { storage } from '../../firebase';
import { AuthenticatedUserContext } from '../../provider';

const View = () => {
    const { user} = useContext(AuthenticatedUserContext);
    const [videos, setVideos] = useState([]);
    const fetchVideos = async () => {
        try {
          const storageRef = ref(storage, `video/${user.uid}`);
          const listResult = await listAll(storageRef);
          const videoUrls = [];
          for (const itemRef of listResult.items) {
            const downloadURL = await getDownloadURL(itemRef);
            videoUrls.push({ url: downloadURL });
          }
          setVideos(videoUrls);
      
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      };
      useEffect(() => {
        fetchVideos();
      }, [videos]);
    
  return (
    <Box overflowY="scroll" maxHeight="80vh" padding="20px">
    {videos.map((videoURL, index) => (
      <Box key={index} marginBottom="20px">
      <video controls style={{ width: '100%', maxHeight: '400px' }} autoPlay preload="auto">
      <source src={videoURL?.url} type="video/mp4" />
    </video>
    </Box>
    ))}
  </Box>
  );
};

export default View;

