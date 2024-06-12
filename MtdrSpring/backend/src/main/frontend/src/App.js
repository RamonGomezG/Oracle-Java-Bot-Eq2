import React, { useState, useEffect } from 'react';
import NewItem from './NewItem';
import UserSelector from './UserSelector';  // Asegúrate de que este importe es correcto
import API_LIST from './API';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TableBody, TableCell, TableRow, CircularProgress, Table } from '@mui/material';
import Moment from 'react-moment';

function App() {
  const [isLoading, setLoading] = useState(false);
  const [isInserting, setInserting] = useState(false);
  const [items, setItems] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    reloadItems();
  }, []);

  useEffect(() => {
    const uniqueUserIds = items.map(item => item.idAssignee).filter((id, index, self) => id && self.indexOf(id) === index);
    setUserIds(uniqueUserIds);
    if (uniqueUserIds.length > 0 && !currentUser) {
      setCurrentUser(uniqueUserIds[0]);  // Establece un usuario por defecto
    }
  }, [items]);

  function reloadItems() {
    setLoading(true);
    fetch(API_LIST)
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        setItems(data);
      })
      .catch(error => {
        setLoading(false);
        setError("Error al cargar elementos.");
      });
  }

  return (
    <div className="App">
      <img src="/logo-transparente.png" alt="Logo" style={{ maxWidth: '200px', paddingBottom: '20px' }} />
      {userIds.length > 0 && (
        <UserSelector users={userIds.map(id => ({ id, name: `Usuario ${id}` }))} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      )}
      <NewItem addItem={addItem} isInserting={isInserting}/>
      {error && <p>Error: {error.message}</p>}
      {isLoading && <CircularProgress />}
      {!isLoading && (
        <>
          <Table>
            <TableBody>
              {items.filter(item => item.idAssignee === currentUser).map(item => (
                <TableRow key={item.id} className={item.done ? "done" : "not-done"}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.details}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{item.complexity}</TableCell>
                  <TableCell>
                    <Moment format="MMM Do YY">{item.creation_ts}</Moment>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => toggleDone(item.id)} size="small">
                      {item.done ? 'Deshacer' : 'Terminada ✅'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button startIcon={<DeleteIcon />} variant="contained" onClick={() => deleteItem(item.id)} size="small">
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

export default App;
