import { useContext, useEffect } from 'react';
import AdminContext from '../context/AdminContext';
import AppContext from '../context/AppContext';
import LoggerContext from '../context/LoggerContext';
import { styled } from '@mui/material/styles';
import { Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import { InputLabel } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import base64ToBlob from '../utils/Base64ToBlob';
import ROSLIB from 'roslib';

function AdminAddCustomer() {
  const { adminAction, setAdminAction } = useContext(AdminContext);
  const { ROS2_HOST, ROS2_PORT } = useContext(AppContext);

  const ros = new ROSLIB.Ros({
    url: `ws://${ROS2_HOST}:${ROS2_PORT}`,
  });

  const {
    COMPRE_API_KEY,
    COMPRE_HOST,
    COMPRE_PORT,
    SERVER_HOST,
    SERVER_PORT,
    capturedImage,
    setCapturedImage,
    setIsPhotoTaken,
    isPhotoTaken,
    isFormValid,
    setIsFormValid,
    formData,
    setFormData,
  } = useContext(AppContext);

  const { showLog } = useContext(LoggerContext);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const isNomorAntrianValid = () => {
    return formData.nomorAntrian.length > 0;
  };

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    const isNamaValid = formData.nama.length > 0;
    const isJenisKelaminValid = formData.jenisKelamin.length > 0;

    setIsFormValid(isNamaValid && isJenisKelaminValid && isNomorAntrianValid());
  }, [formData, setIsFormValid]);

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

  const handleClickedYes = async () => {
    const newId = Date.now().toString();

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

      return;
    }

    try {
      await publishRos();
    } catch (error) {
      console.error('Publish ROS2 error:', error);
    }

    showLog('Berhasil menambah data', 'success');

    setCapturedImage(null);
    setIsPhotoTaken(false);
    setFormData({
      nama: '',
      nomorAntrian: '',
      jenisKelamin: '',
    });

    setAdminAction('');

    window.location.reload();
  };

  const handleClickedNo = () => {
    setCapturedImage(null);
    setIsPhotoTaken(false);
    setFormData({
      nama: '',
      nomorAntrian: '',
      jenisKelamin: '',
    });

    setAdminAction('');
  };

  return (
    <Dialog open={adminAction === 'add'}>
      <DialogContent>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            {`Tambah Pelanggan Baru`}
          </Typography>
          <TextField
            fullWidth
            label="Nama Lengkap"
            margin="normal"
            name="nama"
            onChange={handleFormChange}
            required
            value={formData.nama}
          />
          <TextField
            fullWidth
            label="No. Antrian"
            margin="normal"
            name="nomorAntrian"
            error={!isNomorAntrianValid() && formData.nomorAntrian.length > 0}
            helperText={
              !isNomorAntrianValid() && formData.nomorAntrian.length > 0
                ? 'Nomor antrian tidak valid'
                : ''
            }
            onChange={handleFormChange}
            required
            value={formData.nomorAntrian}
          />
          <InputLabel id="jenisKelaminLabel" sx={{ marginTop: 2 }}>
            Jenis Kelamin
          </InputLabel>
          <Select
            sx={{
              width: '25%',
            }}
            labelId="jenisKelaminLabel"
            name="jenisKelamin"
            onChange={handleFormChange}
            required
            value={formData.jenisKelamin}
          >
            <MenuItem value="L">Pria</MenuItem>
            <MenuItem value="P">Wanita</MenuItem>
          </Select>

          {/* Image Input */}
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'left',
              mt: 2,
            }}
          >
            {capturedImage && (
              <img
                alt="Captured"
                src={capturedImage}
                style={{
                  borderRadius: 8,
                  maxHeight: 200,
                  marginRight: 16,
                  maxWidth: 200,
                }}
              />
            )}
            <Button
              color="primary"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              variant="contained"
              sx={{
                mt: 2,
              }}
            >
              {`Unggah Foto`}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files[0];

                  if (file) {
                    const reader = new FileReader();

                    reader.onload = (event) => {
                      setCapturedImage(event.target.result);
                    };

                    reader.readAsDataURL(file);

                    setIsPhotoTaken(true);
                  }
                }}
                multiple
              />
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => handleClickedNo()}
          color="error"
          sx={{ fontWeight: 900 }}
        >
          {`Batal`}
        </Button>
        <Button
          onClick={() => handleClickedYes()}
          autoFocus
          color="success"
          sx={{ fontWeight: 900 }}
          disabled={!isFormValid || !isPhotoTaken}
        >
          {`Tambah`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdminAddCustomer;
