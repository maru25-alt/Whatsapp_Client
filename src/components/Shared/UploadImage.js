import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import {Avatar} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    input: {
      display: 'none',
    },
  });
 
function UploadImage({  srcUrl, handleUpload , loading}) {
 
    const classes = useStyles();

    return (
        <div className="section">
        <label htmlFor="contained-button-file">
            <Avatar src={srcUrl} className="avatar"></Avatar>
            {loading && <CircularProgress className="progress progress-img"  />}
        </label>
         <input onChange={ handleUpload} accept="image/*" className={classes.input} id="contained-button-file" type="file" />
      </div>
    )
}

export default UploadImage
