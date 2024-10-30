import { useContext, useEffect } from 'react';
import AdminContext from '../context/AdminContext';
import AppContext from '../context/AppContext';
import LoggerContext from '../context/LoggerContext';
import { Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import { InputLabel } from '@mui/material';
import ROSLIB from 'roslib';

function AdminEditCustomer() {
  const { adminAction, setAdminAction } = useContext(AdminContext);
  const { ROS2_HOST, ROS2_PORT } = useContext(AppContext);

  const ros = new ROSLIB.Ros({
    url: `ws://${ROS2_HOST}:${ROS2_PORT}`,
  });

  const {
    SERVER_HOST,
    SERVER_PORT,
    isFormValid,
    setIsFormValid,
    formData,
    setFormData,
  } = useContext(AppContext);

  const { showLog } = useContext(LoggerContext);

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
    console.log('formData:', formData);
    const isNamaValid = formData.nama.length > 0;
    const isJenisKelaminValid = formData.jenisKelamin.length > 0;

    setIsFormValid(isNamaValid && isJenisKelaminValid && isNomorAntrianValid());
  }, [formData, setIsFormValid]);

  const insertOneDatabase = async () => {
    const requestBody = {
      id: formData.id,
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

  const handleClickedYes = async () => {
    try {
      const response = await insertOneDatabase();

      if (!response.ok) {
        console.error('Invalid Response:', response);

        showLog('Gagal ubah data', 'error');

        return;
      }
    } catch (error) {
      console.error('Error:', error);
      showLog('Gagal ubah data', 'error');

      return;
    }

    try {
      await publishRos();
    } catch (error) {
      console.error('Publish ROS2 error:', error);
    }

    showLog('Berhasil ubah data', 'success');

    setFormData({
      nama: '',
      nomorAntrian: '',
      jenisKelamin: '',
    });

    setAdminAction('');

    window.location.reload();
  };

  const handleClickedNo = () => {
    setFormData({
      nama: '',
      nomorAntrian: '',
      jenisKelamin: '',
    });

    setAdminAction('');
  };

  return (
    <Dialog open={adminAction === 'edit'}>
      <DialogContent>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            {`Edit Data Pelanggan`}
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
          disabled={!isFormValid}
        >
          {`Ubah`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdminEditCustomer;
