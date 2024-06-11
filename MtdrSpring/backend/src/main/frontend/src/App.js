import React, { useState, useEffect } from 'react';
import NewItem from './NewItem';
import UserSelector from './UserSelector'; // Asegúrate de tener este componente
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
    const ids = items.map(item => item.idAssignee).filter((value, index, self) => value && self.indexOf(value) === index);
    setUserIds(ids);
    // Opcional: Establecer un usuario por defecto
    if (ids.length > 0 && !currentUser) {
      setCurrentUser(ids[0]);
    }
  }, [items]);

  function reloadItems() {
    setLoading(true);
    fetch(API_LIST)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Algo pasó mal ...');
      }
    })
    .then(data => {
      setLoading(false);
      setItems(data);
    })
    .catch(error => {
      console.error("Error al hacer el fetch:", error);
      setLoading(false);
      setError("Error al cargar elementos.");
    });
  }

  function deleteItem(deleteId) {
    fetch(`${API_LIST}/${deleteId}`, {
      method: 'DELETE',
      headers: {
        'X-Frame-Options': 'DENY',
      }
    })
    .then(response => {
      if (response.ok) {
        const remainingItems = items.filter(item => item.id !== deleteId);
        setItems(remainingItems);
      } else {
        throw new Error('Algo pasó mal ...');
      }
    })
    .catch(error => {
      console.error("Error eliminando elemento:", error);
      setError("Fallo al eliminar el elemento.");
    });
  }

  function addItem(newItem){
    setInserting(true);
    fetch(API_LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
      },
      body: JSON.stringify(newItem),
    }).then(response => {
      if (response.ok) {
        reloadItems(); // Reload all items to see the new addition
        setInserting(false);
      } else {
        throw new Error('Algo pasó mal ...');
      }
    }).catch(error => {
      console.error("Error añadiendo elemento:", error);
      setInserting(false);
      setError("Error al añadir elemento.");
    });
  }

  return (
    <div className="App">
      <img src="/logo-transparente.png" alt="Logo" style={{ maxWidth: '200px', paddingBottom: '20px' }} />
      {userIds.length > 0 && (
        <UserSelector users={userIds} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      )}
      <NewItem addItem={addItem} isInserting={isInserting}/>
      {error && <p>Error: {error.message}</p>}
      {isLoading && <CircularProgress />}
      {!isLoading && (
        <>
          <Table>
            <TableBody>
              {items.filter(item => !item.done && item.idAssignee === currentUser).map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.details}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{item.complexity}</TableCell>
                  <TableCell>
                    <Moment format="MMM Do YY">{item.creation_ts}</Moment>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => toggleDone(item.id, item.description, !item.done, item.details, item.priority, item.complexity)} size="small">
                      Done
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button startIcon={<DeleteIcon />} variant="contained" onClick={() => deleteItem(item.id)} size="small">
                      Delete
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
