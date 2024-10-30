import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import LoggerContext from '../context/LoggerContext';
import AdminContext from '../context/AdminContext';
import AdminAddCustomer from '../components/AdminAddCustomer';
import AdminDeleteCustomer from '../components/AdminDeleteCustomer';
import AdminEditCustomer from '../components/AdminEditCustomer';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import base64ToBlob from '../utils/Base64ToBlob';
import EditIcon from '@mui/icons-material/Edit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { styled } from '@mui/material/styles';

function AdminPage() {
  const { SERVER_HOST, SERVER_PORT, COMPRE_HOST, COMPRE_PORT, COMPRE_API_KEY, isAdminLoggedIn, setFormData } = useContext(AppContext);
  const { showLog } = useContext(LoggerContext);

  const navigate = useNavigate();

  if (!isAdminLoggedIn) {
    navigate('/login');
  }

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

  const insertOneCompreFace = async (id, image) => {
    const imageBlob = base64ToBlob(image, 'image/jpeg');

    console.log(id, imageBlob);

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
    

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      editable: false,
    },
    {
      field: 'nama',
      headerName: 'Nama',
      width: 250,
    },
    {
      field: 'nomorAntrian',
      headerName: 'Nomor Antrian',
      width: 150,
    },
    {
      field: 'jenisKelamin',
      headerName: 'Jenis Kelamin',
      width: 130,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      renderCell: (params) => {
        return (
          <Box>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => {
                setFormData({
                  id: params.row.id,
                  nama: params.row.nama,
                  nomorAntrian: params.row.nomorAntrian,
                  jenisKelamin: params.row.jenisKelamin,
                });

                setAdminAction('edit');
              }}
              sx={{ marginRight: '10px' }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              component="label"
              startIcon={<AddPhotoAlternateIcon/>}
            >
              Tambah Wajah
              <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = async (e) => {
                const image = e.target.result;
                const id = params.row.id;

                try {
                  const response = await insertOneCompreFace(id, image);

                  if (!response.ok) {
                    console.error('Invalid Response:', response);

                    showLog('Wajah tidak terdeteksi', 'error');

                    return;
                  }
                } catch (error) {
                  console.error(error);
                  showLog('Wajah tidak terdeteksi', 'error');

                  return;
                }

                showLog('Berhasil menambahkan data wajah', 'success');
              };

              reader.readAsDataURL(file);
            }
          }}
              />
            </Button>
          </Box>
        );
      },
    }
  ];

  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminAction, setAdminAction] = useState('');

  useEffect(() => {
    setIsLoading(true);

    fetch(`http://${SERVER_HOST}:${SERVER_PORT}/api/get-customer`)
      .then((response) => response.json())
      .then((data) => {
        let rows = [];
        data.forEach((item, index) => {
          rows.push({
            id: item.customerId,
            nama: item.nama,
            nomorAntrian: item.nomorAntrian,
            jenisKelamin: item.jenisKelamin,
          });
        });
        setRows(rows);
        setIsLoading(false);
      });
  }, []);

  return (
    <AdminContext.Provider
      value={{
        selectedRows,
        setSelectedRows,
        adminAction,
        setAdminAction,
      }}
    >
      <Card>
        <CardContent>
          <Typography
            variant="h3"
            sx={{
              marginBottom: '10px',
              fontWeight: 'bold',
            }}
          >
            Admin Page
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            disableColumnMenu
            loading={isLoading}
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
          />

          <Box sx={{ marginTop: '10px' }}>
            <Button
              variant="contained"
              onClick={() => setAdminAction('add')}
              startIcon={<AddIcon />}
              sx={{
                marginRight: '10px',
              }}
            >
              Tambah
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setAdminAction('delete')}
              disabled={selectedRows.length === 0}
            >
              Hapus
            </Button>
          </Box>
          <AdminEditCustomer />
          <AdminAddCustomer />
          <AdminDeleteCustomer />
        </CardContent>
      </Card>
    </AdminContext.Provider>
  );
}

export default AdminPage;
