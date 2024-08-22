import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { Button } from '@mui/material';

function SubmitFormButton() {
  const { isPhotoTaken, photoUrl, apiKey } = useContext(AppContext);
  const handleClick = async () => {
    if (!isPhotoTaken) {
      alert('Please take a photo first!');
      return;
    }

    console.log(apiKey);

    // Convert the data URL to a Blob
    const response = await fetch(photoUrl);
    console.log(response);
    const blob = await response.blob();

    console.log(blob);

    const formData = new FormData();
    formData.append('file', blob, 'captured-image.png'); // Append the blob as a file

    // Replace these with actual values
    const subject = 'Michi';
    const det_prob_threshold = '0.5';

    console.log(formData);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/recognition/faces?subject=${subject}&det_prob_threshold=${det_prob_threshold}`,
        {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
          },
          body: formData, // Send the form data
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Response:', result);
        alert('Image posted successfully!');
      } else {
        console.error('Failed to post image:', response);
        alert('Failed to post image');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while posting the image');
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Submit
    </Button>
  );
}

export default SubmitFormButton;
