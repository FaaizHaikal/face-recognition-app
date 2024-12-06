import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import AppContext from '../context/AppContext';
import LoggerContext from '../context/LoggerContext';
import Camera from '../components/Camera';
import { Box, Button } from '@mui/material';
import base64ToBlob from '../utils/Base64ToBlob';
import cropImageWithOvalShape from '../utils/CropImageWithOvalShape';
import Progress from '../components/Progress';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import ROSLIB from 'roslib';

function DetectSubjectPage() {
  const {
    COMPRE_API_KEY,
    COMPRE_HOST,
    COMPRE_PORT,
    SERVER_HOST,
    SERVER_PORT,
    scoreThreshold,
    cameraRef,
    cameraWidth,
    faceWidth,
    faceHeight,
    isPhotoTaken,
    setIsPhotoTaken,
    subjectId,
    setSubjectId,
    capturedImage,
    setCapturedImage,
    formData,
    setFormData,
  } = useContext(AppContext);
  const { showLog } = useContext(LoggerContext);

  const maxDetectedFaceSec = 4;
  const [detectedFaceSec, setDetectedFaceSec] = useState(0);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [dialogTime, setDialogTime] = useState(5);
  const [isFaceRecognized, setIsFaceRecognized] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();

  const publishRos = async () => {
    const ros = new ROSLIB.Ros({
      url: `ws://${ROS2_HOST}:${ROS2_PORT}`,
    });

    const stringTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/tts',
      messageType: 'std_msgs/String',
    });

    const sapaan = formData.jenisKelamin === 'L' ? 'Bapak' : 'Ibu';

    const message = new ROSLIB.Message({
      data: `${formData.nama};${sapaan}`,
    });

    stringTopic.publish(message);
  };

  const insertOneDatabase = async (id) => {
    const requestBody = {
      id: id,
      nama: formData.nama,
      jenisKelamin: formData.jenisKelamin,
    };

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(
      `http://${SERVER_HOST}:${SERVER_PORT}/api/add-customer`,
      request
    );

    return response;
  };

  const insertOneCompreFace = async (id) => {
    const imageBlob = base64ToBlob(capturedImage, 'image/jpeg');

    const request = new FormData();
    request.append('file', imageBlob, 'image.jpeg');

    const response = await fetch(
      `http://${COMPRE_HOST}:${COMPRE_PORT}/api/v1/recognition/faces?subject=${id}`,
      {
        method: 'POST',
        headers: {
          'x-api-key': COMPRE_API_KEY,
        },
        body: request,
      }
    );

    return response;
  };

  const submitForm = async () => {
    const newId = subjectId ? subjectId : Date.now().toString();

    console.log('Form Data:', formData);
    try {
      const response = await insertOneCompreFace(newId);

      if (!response.ok) {
        console.error('Invalid Response:', response);

        setCapturedImage(null);
        setIsPhotoTaken(false);

        showLog('Wajah tidak terdeteksi', 'error');

        return;
      }
    } catch (error) {
      console.error(error);
      showLog('Wajah tidak terdeteksi', 'error');

      return;
    }

    try {
      const response = await insertOneDatabase(newId);

      if (!response.ok) {
        console.error('Invalid Response:', response);

        setCapturedImage(null);
        setIsPhotoTaken(false);

        showLog('Wajah tidak terdeteksi', 'error');

        return;
      }
    } catch (error) {
      console.error('Error:', error);
      showLog('Gagal menambah data', 'error');
    }

    try {
      await publishRos();
    } catch (error) {
      console.error('Publish ROS2 error:', error);
    }

    setCapturedImage(null);
    setIsPhotoTaken(false);
    setFormData({
      nama: '',
      jenisKelamin: '',
    });
    setSubjectId(null);

    showLog('Selamat Datang!', 'success');

    // Return home
    navigate('/');
  };


  const detectedFaceIsValid = (box) => {
    const area = (box.x_max - box.x_min) * (box.y_max - box.y_min);
    return box.probability > scoreThreshold && area > 4500;
  };

  const fetchCustomer = async (id) => {
    fetch(`http://${SERVER_HOST}:${SERVER_PORT}/api/get-customer?id=${id}`)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            if (data.length > 0) {
              const { nama, jenisKelamin } = data[0];
              setFormData((prev) => ({
                ...prev,
                nama,
                jenisKelamin,
              }));

              setSubjectId(id);

              setIsFaceRecognized(true);
            } else {
              setIsFaceRecognized(false);
            }
          });
        } else {
          console.error('Error:', response);
          setIsFaceRecognized(false);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    setDetectedFaceSec(0);
  };

  const updateDetectedSubject = (data) => {
    const result = data.result[0];
    if (detectedFaceIsValid(result.box)) {
      if (detectedFaceSec > maxDetectedFaceSec) {
        setIsFaceDetected(true);
        if (
          result.subjects.length > 0 &&
          result.subjects[0].similarity > scoreThreshold
        ) {
          const id = result.subjects[0].subject;
          fetchCustomer(id);
        } else {
          setIsFaceRecognized(false);
        }
      } else {
        setDetectedFaceSec((prev) => prev + 1);
      }
    } else {
      setDetectedFaceSec(0);
      setIsFaceDetected(false);
    }
  };

  const requestFaceRecognition = async () => {
    const image = new Image();
    image.src = cameraRef.current.getScreenshot();

    image.onload = () => {
      const imageBlob = base64ToBlob(
        cropImageWithOvalShape(image, faceWidth, faceHeight),
        'image/jpeg'
      );

      const request = new FormData();
      request.append('file', imageBlob, 'image.jpeg');

      fetch(
        `http://${COMPRE_HOST}:${COMPRE_PORT}/api/v1/recognition/recognize?&limit=1&det_prob_threshold=${scoreThreshold}`,
        {
          method: 'POST',
          headers: {
            'x-api-key': COMPRE_API_KEY,
          },
          body: request,
        }
      )
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              updateDetectedSubject(data);
            });
          } else {
            setDetectedFaceSec(0);
            setIsFaceDetected(false);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setDetectedFaceSec(0);
          setIsFaceDetected(false);
        });
    };
  };

  const captureImage = () => {
    const image = new Image();
    image.src = cameraRef.current.getScreenshot();

    image.onload = () => {
      setCapturedImage(cropImageWithOvalShape(image, faceWidth, faceHeight));
      setIsPhotoTaken(true);
    };
  };

  const handleClick = (resetData) => () => {
    if (resetData) {
      setFormData((prev) => ({
        ...prev,
        nama: '',
        jenisKelamin: '',
      }));

      setSubjectId(null);

      navigate('/form');
    } else {
      submitForm();
      setIsFaceDetected(false);
    }
  };

  useEffect(() => {
    if (isFaceDetected) {
      console.log('dialog Time:', dialogTime);
      console.log('isPhotoTaken:', isPhotoTaken);
      if (isPhotoTaken) {
        const interval = setInterval(() => {
          setDialogTime((prev) => prev - 1);
        }, 1000);

        if (dialogTime <= 0) {
          setIsFaceDetected(false);
          setDialogTime(5);
          setFormData({
            nama: '',
            jenisKelamin: '',
          });
          setSubjectId(null);
          setIsPhotoTaken(false);
          setDetectedFaceSec(0);
        }

        return () => {
          clearInterval(interval);
        }
      }



      captureImage();
    }

    const interval = setInterval(() => {
      requestFaceRecognition();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <Box
      width={cameraWidth}
      sx={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -25%)',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          marginBottom: 2,
          fontWeight: 'bold',
        }}
      >
        Hadapkan wajah Anda ke kamera
      </Typography>
      {isPhotoTaken ? (
        <img src={capturedImage} style={{ borderRadius: 30 }} />
      ) : (
        <Camera />
      )}
      <Progress value={detectedFaceSec * (100 / maxDetectedFaceSec)} />
      <Dialog
        fullScreen={fullScreen}
        open={isFaceDetected}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            {isFaceRecognized ? (
              <p>
                Selamat datang! Apakah Anda <strong>{formData.nama}</strong>? (<strong>{dialogTime}</strong>)
              </p>
            ) : (
              <p>Wajah Anda tidak dikenali. Harap mengisi data selanjutnya.</p>
            )}
          </DialogContentText>
        </DialogContent>
        {isFaceRecognized ? (
          <DialogActions>
            <Button
              autoFocus
              onClick={handleClick(true)}
              color="error"
              sx={{ fontWeight: 900 }}
            >
              {`Tidak`}
            </Button>
            <Button
              onClick={handleClick(false)}
              autoFocus
              color="success"
              sx={{ fontWeight: 900 }}
            >
              {`Ya`}
            </Button>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button
              autoFocus
              onClick={handleClick(true)}
              sx={{ fontWeight: 900 }}
            >
              {`Lanjutkan`}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
}

export default DetectSubjectPage;
