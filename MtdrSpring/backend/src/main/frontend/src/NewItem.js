import React, { useState } from "react";
import { Button, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

function NewItem(props) {
  const [item, setItem] = useState({
    description: '',
    details: '',
    priority: '1', // valor predeterminado
    complexity: '1', // valor predeterminado
  });

  // Actualizar para manejar los cambios en los campos del formulario
  function handleChange(e) {
    const { name, value } = e.target;
    setItem(prevItem => ({
      ...prevItem,
      [name]: value
    }));
  }

  // Asegúrate de enviar el objeto de ítem actualizado
  function handleSubmit(e) {
    e.preventDefault();
    if (!item.description.trim()) {
      return;
    }
    props.addItem(item);
    setItem({
      description: '',
      details: '',
      priority: '1',
      complexity: '1',
    });
  }

  return (
    <div id="newinputform">
      <form>
        <TextField
          name="description"
          label="Task Description"
          type="text"
          variant="outlined"
          value={item.description}
          onChange={handleChange}
        />
        <TextField
          name="details"
          label="Detail"
          type="text"
          variant="outlined"
          value={item.details}
          onChange={handleChange}
        />
        <FormControl variant="outlined">
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={item.priority}
            onChange={handleChange}
            label="Priority"
          >
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel>Complexity</InputLabel>
          <Select
            name="complexity"
            value={item.complexity}
            onChange={handleChange}
            label="Complexity"
          >
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
          </Select>
        </FormControl>
        <Button
          className="AddButton"
          variant="contained"
          disabled={props.isInserting}
          onClick={!props.isInserting ? handleSubmit : null}
          size="small"
        >
          {props.isInserting ? 'Adding…' : 'Add'}
        </Button>
      </form>
    </div>
  );
}

export default NewItem;
