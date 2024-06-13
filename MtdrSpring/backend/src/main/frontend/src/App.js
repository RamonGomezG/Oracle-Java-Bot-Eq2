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
  const [currentUser, setCurrentUser] = useState('all');
  const [error, setError] = useState();

  // Mapeo de TelegramID a nombres según la imagen
  const userNames = {
    '6893855367': 'Luis Ángel González',
    '1038242307': 'Alexander Alexeev',
    '1076024199': 'Ramon Gómez',
    '7035839758': 'Aaron Inzunza',
    '7082155646': 'Kenyu Medina'
  };

  useEffect(() => {
    reloadItems();
  }, [currentUser]);

  function reloadItems() {
    setLoading(true);
    const url = currentUser === 'all' ? API_LIST : `${API_LIST}?idAssignee=${currentUser}`;
    fetch(url)
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
      method: 'DELETE'
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
    return fetch(API_LIST + "/" + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
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

  function addItem(newItem) {
    setInserting(true);
    fetch(API_LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem),
    }).then(response => {
      if (response.ok) {
        reloadItems();
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
      <div class="user-selector-container">
        <FormControl fullWidth>
          <InputLabel id="user-selector-label">Usuario</InputLabel>
          <Select
            labelId="user-selector-label"
            id="user-selector"
            value={currentUser}
            label="Usuario"
            onChange={(e) => setCurrentUser(e.target.value)}
          >
            <MenuItem value="all">Todas las tasks</MenuItem>
            {Object.entries(userNames).map(([telegramID, name]) => (
              <MenuItem key={telegramID} value={telegramID}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <NewItem addItem={addItem} isInserting={isInserting}/>
      {error && <p>Error: {error.message}</p>}
      {isLoading && <CircularProgress />}
      {!isLoading && (
        <>
          <h2 className="section-header">🧑‍💻TASKS PENDIENTES🧑‍💻</h2>
          <Table>
            <TableBody>
              {items.filter(item => !item.done).map(item => (
                <TableRow key={item.id} className="not-done">
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.details}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{item.complexity}</TableCell>
                  <TableCell>
                    <Moment format="MMM Do YY">{item.creation_ts}</Moment>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={(event) => toggleDone(event, item.id, item.description, !item.done, item.details, item.priority, item.complexity)} size="small">
                      Terminada✅
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
          <h2 className="section-header">🧑‍💻TASKS TERMINADAS🧑‍💻</h2>
          <Table>
            <TableBody>
              {items.filter(item => item.done).map(item => (
                <TableRow key={item.id} className="done">
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.details}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{item.complexity}</TableCell>
                  <TableCell>
                    <Moment format="MMM Do YY">{item.creation_ts}</Moment>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={(event) => toggleDone(event, item.id, item.description, !item.done, item.details, item.priority, item.complexity)} size="small">
                      Deshacer
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
