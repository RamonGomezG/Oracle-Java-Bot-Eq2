import React, { useState, useEffect } from 'react';
import NewItem from './NewItem';
import API_LIST from './API';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TableBody, TableCell, TableRow, CircularProgress, Table } from '@mui/material';
import Moment from 'react-moment';

function App() {
  const [isLoading, setLoading] = useState(false);
  const [isInserting, setInserting] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState();

  function deleteItem(deleteId) {
    fetch(API_LIST + "/" + deleteId, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        throw new Error('Something went wrong ...');
      }
    })
    .then(
      () => {
        const remainingItems = items.filter(item => item.id !== deleteId);
        setItems(remainingItems);
      },
      (error) => {
        setError(error);
      }
    );
  }

  function toggleDone(event, id, description, done, details, priority, complexity) {
    event.preventDefault();
    modifyItem(id, description, done, details, priority, complexity).then(
      () => { reloadOneIteam(id); },
      (error) => { setError(error); }
    );
  }

  function reloadOneIteam(id){
    fetch(API_LIST + "/" + id)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
    })
    .then(
      (result) => {
        const items2 = items.map(
          x => (x.id === id ? {
             ...x,
             description: result.description,
             done: result.done,
             details: result.details,
             priority: result.priority,
             complexity: result.complexity
            } : x));
        setItems(items2);
      },
      (error) => {
        setError(error);
      });
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
        return response;
      } else {
        throw new Error('Something went wrong ...');
      }
    });
  }

  useEffect(() => {
    setLoading(true);
    fetch(API_LIST)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
    })
    .then(
      (result) => {
        setLoading(false);
        setItems(result);
      },
      (error) => {
        setLoading(false);
        setError(error);
      });
  }, []);

  function addItem(newItem){
    setInserting(true);
    fetch(API_LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
    }).then(
      (result) => {
        setItems([result, ...items]);
        setInserting(false);
      },
      (error) => {
        setInserting(false);
        setError(error);
      }
    );
  }

  return (
    <div className="App">
      <img src="/logo-transparente.png" alt="Logo" style={{ maxWidth: '200px', paddingBottom: '20px' }} />
      <NewItem addItem={addItem} isInserting={isInserting}/>
      { error &&
        <p>Error: {error.message}</p>
      }
      { isLoading && <CircularProgress /> }
      { !isLoading &&
        <Table>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id} hover>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.details}</TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell>{item.complexity}</TableCell>
                <TableCell>
                  <Moment format="MMM Do YY">{item.createdAt}</Moment>
                </TableCell>
                <TableCell>
                  <Button variant="contained" onClick={(event) => toggleDone(event, item.id, item.description, !item.done, item.details, item.priority, item.complexity)} size="small">
                    {item.done ? 'Undo' : 'Done'}
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
      }
    </div>
  );
}

export default App;
