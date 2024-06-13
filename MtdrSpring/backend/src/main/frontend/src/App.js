import React, { useState, useEffect } from 'react';
import NewItem from './NewItem';
import API_LIST from './API';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TableBody, TableCell, TableRow, CircularProgress, Table, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Moment from 'react-moment';

function App() {
  const [isLoading, setLoading] = useState(false);
  const [isInserting, setInserting] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState();
  const [currentUser, setCurrentUser] = useState('all'); // 'all' para todas las tareas

  useEffect(() => {
    reloadItems();
  }, []);

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

  function toggleDone(event, id, description, done, details, priority, complexity) {
    event.preventDefault();
    modifyItem(id, description, done, details, priority, complexity).then(
      updatedItem => {
        const updatedItems = items.map(item => item.id === id ? updatedItem : item);
        setItems(updatedItems);
      },
      error => {
        console.error("Error actualizando elemento:", error);
        setError("Fallo al actualizar el elemento.");
      }
    );
  }

  function modifyItem(id, description, done, details, priority, complexity) {
    var data = { description, done, details, priority, complexity };
    return fetch(`${API_LIST}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Algo pasó mal ...');
      }
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
        reloadItems();  // Reload all items to see the new addition
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

  function handleUserChange(event) {
    setCurrentUser(event.target.value);
  }

  const uniqueUsers = Array.from(new Set(items.map(item => item.idAssignee).filter(Boolean)));
  uniqueUsers.unshift('all'); // Añade la opción de ver todas las tareas al principio

  return (
    <div className="App">
      <img src="/logo-transparente.png" alt="Logo" style={{ maxWidth: '200px', paddingBottom: '20px' }} />
      <FormControl fullWidth margin="normal">
        <InputLabel id="user-selector-label">Filtrar por usuario</InputLabel>
        <Select
          labelId="user-selector-label"
          id="user-selector"
          value={currentUser}
          label="Usuario"
          onChange={handleUserChange}
        >
          <MenuItem value="all">Todas las tasks</MenuItem>
          {uniqueUsers.map(user => (
            user !== 'all' && <MenuItem key={user} value={user}>{`Usuario ${user}`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <NewItem addItem={addItem} isInserting={isInserting}/>
      {error && <p>Error: {error.message}</p>}
      {isLoading && <CircularProgress />}
      {!isLoading && (
        <>
          <Table>
            <TableBody>
              {items.filter(item => currentUser === 'all' || item.idAssignee === currentUser).map(item => (
                <TableRow key={item.id} className={item.done ? 'done' : 'not-done'}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.details}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{item.complexity}</TableCell>
                  <TableCell>
                    <Moment format="MMM Do YY">{item.creation_ts}</Moment>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={(event) => toggleDone(event, item.id, item.description, !item.done, item.details, item.priority, item.complexity)} size="small">
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
