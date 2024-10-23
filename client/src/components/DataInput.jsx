import { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { Box, TextField } from '@mui/material';

function DataInput() {
  const { formData, setFormData, setIsFormValid } = useContext(AppContext);

  const isNomorAntrianValid = () => {
    return formData.nomorAntrian.length > 0;
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    const isNamaValid = formData.nama.length > 0;

    setIsFormValid(isNamaValid && isNomorAntrianValid());
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
