import { useContext } from 'react';
import AdminContext from '../context/AdminContext';
import AppContext from '../context/AppContext';
import LoggerContext from '../context/LoggerContext';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { Button } from '@mui/material';

function AdminDeleteCustomer() {
  const { adminAction, setAdminAction, selectedRows } =
    useContext(AdminContext);

  const { SERVER_HOST, SERVER_PORT, COMPRE_API_KEY, COMPRE_HOST, COMPRE_PORT } =
    useContext(AppContext);
    const { showLog } = useContext(LoggerContext);

  const deleteManyDatabase = async () => {
    const response = await fetch(
      `http://${SERVER_HOST}:${SERVER_PORT}/api/delete-customer`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedRows),
      }
    );
  };

  const deleteManyCompreFace = async () => {
    selectedRows.forEach(async (nik) => {
      const response = await fetch(
        `http://${COMPRE_HOST}:${COMPRE_PORT}/api/v1/recognition/faces?subject=${nik}`,
        {
          method: 'DELETE',
          headers: {
            'x-api-key': COMPRE_API_KEY,
          },
          body: JSON.stringify({ nik }),
        }
      );
    });
  };

  const handleClickedYes = () => {
    deleteManyCompreFace();
    deleteManyDatabase();
    setAdminAction('');

    showLog('Data berhasil dihapus', 'success');

    window.location.reload();
  };

  const handleClickedNo = () => {
    setAdminAction('');
  };

  return (
    <Dialog open={adminAction === 'delete'}>
      <DialogContent>
        <DialogContentText>
          {`Apakah Anda yakin ingin menghapus `}
          <strong>{selectedRows.length} data</strong>
          {` ini?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => handleClickedNo()}
          color="success"
          sx={{ fontWeight: 900 }}
        >
          {`Batal`}
        </Button>
        <Button
          onClick={() => handleClickedYes()}
          autoFocus
          color="error"
          sx={{ fontWeight: 900 }}
        >
          {`Hapus`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdminDeleteCustomer;
