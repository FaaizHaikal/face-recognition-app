import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import LoggerContext from '../context/LoggerContext';
import { Button } from '@mui/material';
import base64ToBlob from '../utils/Base64ToBlob';

function SubmitFormButton() {
  const {
    COMPRE_API_KEY,
    isPhotoTaken,
    setIsPhotoTaken,
    capturedImage,
    setCapturedImage,
    isFormValid,
    formData,
    setFormData,
  } = useContext(AppContext);
  const { showLog } = useContext(LoggerContext);

  const navigate = useNavigate();
  
  const updateDatabase = async () => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/add-customer`,
        request
      );

      if (response.ok) {
        showLog('Form submitted successfully', 'success');
        setCapturedImage(null);
        setIsPhotoTaken(false);
        setFormData({
          nama: '',
          nik: '',
          nomorAntrian: '',
        });

        // Return home
        navigate('/');
      } else {
        console.error('Invalid Response:', response);

        setCapturedImage(null);
        setIsPhotoTaken(false);

        showLog('Face not detected', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showLog('Failed to submit form', 'error');
    }
  }

  const handleClick = async () => {
    if (!isPhotoTaken) {
      showLog('Please take a photo first', 'warning');
      return;
    }

    if (!isFormValid) {
      showLog('Please fill the form correctly', 'warning');
      return;
    }

    const imageBlob = base64ToBlob(capturedImage, 'image/jpeg');

    const request = new FormData();
    request.append('file', imageBlob, 'image.jpeg');

    const subject = formData.nik;

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/recognition/faces?subject=${subject}`,
        {
          method: 'POST',
          headers: {
            'x-api-key': COMPRE_API_KEY,
          },
          body: request,
        }
      );

      if (response.ok) {
        updateDatabase()
        showLog('Form submitted successfully', 'success');
        setCapturedImage(null);
        setIsPhotoTaken(false);
        setFormData({
          nama: '',
          nik: '',
          nomorAntrian: '',
        });

        // Return home
        navigate('/');
      } else {
        console.error('Invalid Response:', response);

        setCapturedImage(null);
        setIsPhotoTaken(false);

        showLog('Face not detected', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showLog('Failed to submit form', 'error');
    }
  };

  return (
    <Button variant="contained" color="success" onClick={handleClick}>
      Submit
    </Button>
  );
}

export default SubmitFormButton;
