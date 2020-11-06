import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import ContactInfo from './ChatInfo'

export default function FadeMenu({chatInfo}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
       <MoreVertIcon/>
      </IconButton>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>
            <ContactInfo  chatInfo={chatInfo}/>
        </MenuItem>
        <MenuItem onClick={handleClose}>Clear Messages</MenuItem>
        <MenuItem onClick={handleClose}>Delete Chat</MenuItem>
      </Menu>

    </div>
  );
}