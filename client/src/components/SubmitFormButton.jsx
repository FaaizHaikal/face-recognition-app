import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import LoggerContext from '../context/LoggerContext';
import { Button } from '@mui/material';
import base64ToBlob from '../utils/Base64ToBlob';
import ROSLIB from 'roslib';

function SubmitFormButton() {
  const {
    COMPRE_API_KEY,
    COMPRE_HOST,
    COMPRE_PORT,
    ROS2_HOST,
    ROS2_PORT,
    SERVER_HOST,
    SERVER_PORT,
    isPhotoTaken,
    setIsPhotoTaken,
    subjectId,
    setSubjectId,
    capturedImage,
    setCapturedImage,
    isFormValid,
    formData,
    setFormData,
  } = useContext(AppContext);
  const { showLog } = useContext(LoggerContext);

  const navigate = useNavigate();

  const ros = new ROSLIB.Ros({
    url: `ws://${ROS2_HOST}:${ROS2_PORT}`,
  });

  const publishRos = async () => {
    const stringTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/tts',
      messageType: 'std_msgs/String',
    });

    const sapaan = formData.jenisKelamin === 'L' ? 'Bapak' : 'Ibu';

    const message = new ROSLIB.Message({
      data: `${formData.nama};${formData.nomorAntrian};${sapaan}`,
    });

    stringTopic.publish(message);
  };

  const insertOneDatabase = async (id) => {
    const requestBody = {
      id: id,
      nama: formData.nama,
      nomorAntrian: formData.nomorAntrian,
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

  const handleClick = async () => {
    if (!isPhotoTaken) {
      showLog('Tolong ambil foto terlebih dahulu', 'warning');
      return;
    }

    if (!isFormValid) {
      showLog('Tolong isi data dengan benar', 'warning');
      return;
    }

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
      nomorAntrian: '',
      jenisKelamin: '',
    });
    setSubjectId(null);

    showLog('Berhasil menambah data', 'success');

    // Return home
    navigate('/');
  };

  return (
    <Button variant="contained" color="success" onClick={handleClick}>
      Submit
    </Button>
  );
}

export default SubmitFormButton;
