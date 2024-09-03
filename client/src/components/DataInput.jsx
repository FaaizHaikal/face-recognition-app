import { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { Box, TextField } from '@mui/material';

function DataInput() {
  const { formData, setFormData, setIsFormValid } = useContext(AppContext);

  const isNikValid = () => {
    return formData.nik.length === 16 && !isNaN(Number(formData.nik));
  };

  const isNomorAntrianValid = () => {
    return (
      formData.nomorAntrian.length > 0 && !isNaN(Number(formData.nomorAntrian))
    );
  };

  const handleChange = (event) => {
    if (event.target.name === 'nik' || event.target.name === 'nomorAntrian') {
      if (isNaN(Number(event.target.value))) {
        return;
      }
    }

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    const isNamaValid = formData.nama.length > 0;

    setIsFormValid(isNamaValid && isNikValid() && isNomorAntrianValid());
  }, [formData, setIsFormValid]);

  return (
    <Box margin={2}>
      <TextField
        fullWidth
        label="Nama Lengkap"
        margin="normal"
        name="nama"
        onChange={handleChange}
        required
        value={formData.nama}
      />
      <TextField
        fullWidth
        label="NIK"
        margin="normal"
        name="nik"
        error={!isNikValid() && formData.nik.length > 0}
        helperText={
          !isNikValid() && formData.nik.length > 0
            ? 'NIK harus terdiri dari 16 digit angka'
            : ''
        }
        onChange={handleChange}
        required
        value={formData.nik}
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
        onChange={handleChange}
        required
        value={formData.nomorAntrian}
      />
    </Box>
  );
}

export default DataInput;
