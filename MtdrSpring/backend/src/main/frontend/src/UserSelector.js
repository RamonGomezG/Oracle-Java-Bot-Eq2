import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function UserSelector({ userIds, currentUser, setCurrentUser }) {
  const handleChange = (event) => {
    setCurrentUser(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="user-selector-label">Usuario</InputLabel>
      <Select
        labelId="user-selector-label"
        id="user-selector"
        value={currentUser}
        label="Usuario"
        onChange={handleChange}
      >
        {userIds.map(userId => (
          <MenuItem key={userId} value={userId}>Usuario {userId}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default UserSelector;
