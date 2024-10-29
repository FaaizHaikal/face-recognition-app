import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import LoggerContext from '../context/LoggerContext';
import { Button } from '@mui/material';
import base64ToBlob from '../utils/Base64ToBlob';

function SubmitFormButton() {
  const {
    COMPRE_API_KEY,
    COMPRE_HOST,
    COMPRE_PORT,
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

  const insertOneDatabase = async (id) => {
    const requestBody = {
      id: id,
      nama: formData.nama,
      nomorAntrian: formData.nomorAntrian,
    }

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
      showLog('Please take a photo first', 'warning');
      return;
    }

    if (!isFormValid) {
      showLog('Please fill the form correctly', 'warning');
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

        showLog('Face not detected', 'error');

        return;
      }
    } catch (error) {
      console.error(error);
      showLog('Face is not detected', 'error');

      return;
    }

    try {
      const response = await insertOneDatabase(newId);

      if (!response.ok) {
        console.error('Invalid Response:', response);

        setCapturedImage(null);
        setIsPhotoTaken(false);

        showLog('Face not detected', 'error');

        return;
      }
    } catch (error) {
      console.error('Error:', error);
      showLog('Failed to submit form', 'error');
    }

    setCapturedImage(null);
    setIsPhotoTaken(false);
    setFormData({
      nama: '',
      nomorAntrian: '',
    });
    setSubjectId(null);

    showLog('Form submitted successfully', 'success');

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
