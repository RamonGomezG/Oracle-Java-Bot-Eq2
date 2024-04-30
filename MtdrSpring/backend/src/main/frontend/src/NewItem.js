import React, { useState } from "react";
import { Button, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

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
          label="Detailed Description"
          type="text"
          variant="outlined"
          value={item.details}
          onChange={handleChange}
        />
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={item.priority}
            onChange={handleChange}
            label="Priority"
          >
            <MenuItem value={1}>High</MenuItem>
            <MenuItem value={2}>Medium</MenuItem>
            <MenuItem value={3}>Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Complexity</InputLabel>
          <Select
            name="complexity"
            value={item.complexity}
            onChange={handleChange}
            label="Complexity"
          >
            <MenuItem value={1}>Simple</MenuItem>
            <MenuItem value={2}>Moderate</MenuItem>
            <MenuItem value={3}>Complex</MenuItem>
          </Select>
        </FormControl>
        <Button
          className="AddButton"
          variant="contained"
          type="submit"
          disabled={props.isInserting}
          size="small"
        >
          {props.isInserting ? 'Adding…' : 'Add'}
        </Button>
      </form>
    </div>
  );
}

export default NewItem;
