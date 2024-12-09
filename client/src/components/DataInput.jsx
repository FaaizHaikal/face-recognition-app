import { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { Box, MenuItem, TextField } from '@mui/material';
import { Select } from '@mui/material';
import { InputLabel } from '@mui/material';

function DataInput() {
  const { formData, setFormData, setIsFormValid } = useContext(AppContext);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    const isNamaValid = formData.nama.length > 0;
    const isJenisKelaminValid = formData.jenisKelamin.length > 0;

    setIsFormValid(isNamaValid && isJenisKelaminValid);
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
      <InputLabel id="jenisKelaminLabel" sx={{ marginTop: 2 }}>
        Jenis Kelamin
      </InputLabel>
      <Select
        sx={{
          width: '100px',
        }}
        labelId="jenisKelaminLabel"
        name="jenisKelamin"
        onChange={handleChange}
        required
        value={formData.jenisKelamin}
      >
        <MenuItem value="L">Pria</MenuItem>
        <MenuItem value="P">Wanita</MenuItem>
      </Select>
    </Box>
  );
}

export default DataInput;
