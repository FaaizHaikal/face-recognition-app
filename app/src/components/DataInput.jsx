import { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { Box, TextField } from '@mui/material';

function DataInput() {
  const { formData, setFormData, isFormValid, setIsFormValid } = useContext(AppContext);

  const isNikValid = (nik) => {
    const nikLength = nik.length;
    if (nikLength !== 16) {
      return false;
    }

    const nikNumber = Number(nik);
    if (isNaN(nikNumber)) {
      return false;
    }

    return true;
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  useEffect(() => {
    const isNamaValid = formData.Nama.length > 0;
    const isNikValidValue = isNikValid(formData.NIK);

    setIsFormValid(isNamaValid && isNikValidValue);
  }, [formData, setIsFormValid]);

  return (
    <Box
      margin={2}
    >
        <TextField
          fullWidth
          label="Nama"
          margin="normal"
          name="Nama"
          onChange={handleChange}
          required
          value={formData.Nama}
        />
        <TextField
          fullWidth
          label="NIK"
          margin="normal"
          name="NIK"
          error={!isNikValid(formData.NIK) && formData.NIK.length > 0}
          helperText={!isNikValid(formData.NIK) && formData.NIK.length > 0 ? 'NIK harus terdiri dari 16 digit angka' : ''}
          onChange={handleChange}
          required
          value={formData.NIK}
        />
    </Box>
  );
}

export default DataInput;
