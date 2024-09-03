import { useEffect, useRef, useState, useContext } from 'react';
import AppContext from '../context/AppContext';
import base64ToBlob from '../utils/Base64ToBlob';

import Camera from './Camera';

function CameraFrame() {
  // const {
  //   apiKey,
  //   cameraWidth,
  //   cameraHeight,
  //   faceWidth,
  //   faceHeight,
  //   scoreThreshold,
  //   cameraRef,
  //   capturedImage,
  //   isPhotoTaken,
  //   isFlashActive,
  //   setFormData,
  // } = useContext(AppContext);

  // const updateDetectedSubject = (data) => {
  //   const result = data.result[0];
  //   if (result.box.probability > scoreThreshold) {
  //     if (result.subjects.length > 0) {
  //       const [nik, nama] = result.subjects[0].subject.split('_');
  //       setFormData((prev) => ({
  //         ...prev,
  //         nama: nama,
  //         nik: nik,
  //       }));
  //     } else {
  //       console.log('Face detected but not recognized');
  //     }
  //   }
  // };

  // const requestFaceRecognition = async () => {
  //   const imageBlob = base64ToBlob(
  //     cameraRef.current.getScreenshot(),
  //     'image/jpeg'
  //   );

  //   const request = new FormData();
  //   request.append('file', imageBlob, 'image.jpeg');

  //   fetch(
  //     `http://localhost:8000/api/v1/recognition/recognize?&limit=1&det_prob_threshold=${scoreThreshold}`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'x-api-key': apiKey,
  //       },
  //       body: request,
  //     }
  //   )
  //     .then((response) => {
  //       if (response.ok) {
  //         response.json().then((data) => {
  //           updateDetectedSubject(data);
  //         });
  //       } else {
  //         console.error('Invalid Response:', response);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // };

  // useEffect(() => {
  //   if (isPhotoTaken) {
  //     return;
  //   }

  //   const canvas = canvasRef.current;
  //   createOvalHole(canvas, cameraWidth, cameraHeight, faceWidth, faceHeight);

  //   const interval = setInterval(() => {
  //     requestFaceRecognition();
  //   }, 500);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [isPhotoTaken]);

  return (
    // <Grid container direction="column" justifyContent="center">
    //   <Grid item>
    //     {isPhotoTaken ? (
    //       <img
    //         src={capturedImage}
    //         style={{borderRadius: 30}}
    //         />
    //     ) : (
    //       <Box>
    //         <Webcam
    //           ref={cameraRef}
    //           mirrored={true}
    //           audio={false}
    //           videoConstraints={videoConstraints}
    //           screenshotFormat="image/jpeg"
    //           style={{ zIndex: -1, position: 'absolute', borderRadius: 30 }}
    //         />
    //         {isFlashActive && <Flash />}
    //         <canvas
    //         ref={canvasRef}
    //         style={{borderRadius: 30}}
    //         />
    //       </Box>
    //     )}
    //   </Grid>
    //   <Grid item>
    //     {isPhotoTaken ? <RetakeImageButton /> : <CaptureImageButton />}
    //   </Grid>
    // </Grid>
    <Camera />
  );
}

export default CameraFrame;
