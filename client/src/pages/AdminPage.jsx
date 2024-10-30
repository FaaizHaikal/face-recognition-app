import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';
import AdminAddCustomer from '../components/AdminAddCustomer';
import AdminDeleteCustomer from '../components/AdminDeleteCustomer';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function AdminPage() {
  const { SERVER_HOST, SERVER_PORT, isAdminLoggedIn } = useContext(AppContext);

  const navigate = useNavigate();

  if (!isAdminLoggedIn) {
    navigate('/login');
  }
    

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
      editable: true,
    },
    {
      field: 'nomorAntrian',
      headerName: 'Nomor Antrian',
      width: 150,
      editable: true,
    },
  ];

  const handleRowUpdate = async (updatedRow, originalRow) => {
    const id = originalRow.id;
    const { nama, nomorAntrian } = updatedRow;

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, nama, nomorAntrian }),
    };

    const response = await fetch(
      `http://${SERVER_HOST}:${SERVER_PORT}/api/add-customer`,
      request
    );

    if (response.ok) {
      console.log('Data berhasil diubah');
    }
  };

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
            processRowUpdate={(updatedRow, originalRow) => {
              handleRowUpdate(updatedRow, originalRow);

              return updatedRow;
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
          <AdminAddCustomer />
          <AdminDeleteCustomer />
        </CardContent>
      </Card>
    </AdminContext.Provider>
  );
}

export default AdminPage;
