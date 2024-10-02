import React, { useEffect, useState, useContext } from 'react';
import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminAddCustomer from '../components/AdminAddCustomer';
import { Button, Box, Card, CardContent, Typography } from '@mui/material';

function AdminPage() {
  const { SERVER_HOST, SERVER_PORT } = useContext(AppContext);

  const pageSize = 10;

  const columns = [
    {
      field: 'id',
      headerName: 'NIK',
      width: 150,
      editable: false,
    },
    {
      field: 'nama',
      headerName: 'Nama',
      width: 250,
      editable: true,
    },
    {
      field: 'nomorAntrian',
      headerName: 'Nomor Antrian',
      width: 150,
      editable: true,
    },
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
            id: item.nik,
            nama: item.nama,
            nomorAntrian: item.nomorAntrian,
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
            color="success"
            onClick={() => setAdminAction('save')}
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={() => setAdminAction('add')}
            startIcon={<AddIcon />}
            sx={{
              marginLeft: '10px',
              marginRight: '10px',
            }}
          >
            Add
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setAdminAction('delete')}
          >
            Delete
          </Button>
          </Box>
          {adminAction === 'add' && <AdminAddCustomer />}
        </CardContent>
      </Card>
    </AdminContext.Provider>
  );
}

export default AdminPage;
