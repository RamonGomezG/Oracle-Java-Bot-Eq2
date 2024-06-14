import React, { useState } from "react";
import { Button, TextField, MenuItem, FormControl, InputLabel, Select, Grid } from '@mui/material';

function NewItem(props) {
  const [item, setItem] = useState({
    description: '',
    details: '',
    priority: 1, // valor predeterminado como número
    complexity: 1, // valor predeterminado como número
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setItem(prevItem => ({
      ...prevItem,
      [name]: name === "priority" || name === "complexity" ? parseInt(value) : value
    }));
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    if (!item.description.trim()) {
      alert("Por favor escribe una descripción del task."); // Aviso al usuario si el campo está vacío
      return;
    }
    props.addItem(item);
    setItem({
      description: '',
      details: '',
      priority: 1,
      complexity: 1,
    });
  }

  return (
    <div id="newinputform">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Agregar Título"
              type="text"
              variant="outlined"
              fullWidth
              value={item.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="details"
              label="Agregar Descripción"
              type="text"
              variant="outlined"
              fullWidth
              value={item.details}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Prioridad</InputLabel>
              <Select
                name="priority"
                value={item.priority}
                onChange={handleChange}
                label="Priority"
              >
                <MenuItem value={1}>🟥 Alta</MenuItem>
                <MenuItem value={2}>🟧 Media</MenuItem>
                <MenuItem value={3}>🟨 Baja</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Complejidad</InputLabel>
              <Select
                name="complexity"
                value={item.complexity}
                onChange={handleChange}
                label="Complexity"
              >
                <MenuItem value={1}>😎 Simple</MenuItem>
                <MenuItem value={2}>🤨 Moderada</MenuItem>
                <MenuItem value={3}>😰 Compleja</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Button
              className="AddButton"
              variant="contained"
              type="submit"
              disabled={props.isInserting}
              fullWidth
              size="large"
            >
              {props.isInserting ? 'Creando...' : '🆕Crear Task🆕'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default NewItem;
