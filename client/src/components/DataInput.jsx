import { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { Box, MenuItem, TextField } from '@mui/material';
import { Select } from '@mui/material';
import { InputLabel } from '@mui/material';

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
    const isJenisKelaminValid = formData.jenisKelamin.length > 0;

    setIsFormValid(isNamaValid && isJenisKelaminValid && isNomorAntrianValid());
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
      <InputLabel id="jenisKelaminLabel" sx={{ marginTop: 2 }}>
        Jenis Kelamin
      </InputLabel>
      <Select
        sx={{
          width: '15%',
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
