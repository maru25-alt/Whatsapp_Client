import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Input , InputAdornment, IconButton ,CircularProgress } from '@material-ui/core';
import {LocalStorageVariables} from '../../utils/localStorage';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
import axios from '../../utils/axios';
import ArrowIcon from '@material-ui/icons/ArrowBack';
import UploadImage from '../Shared/UploadImage';
import {storage} from '../../utils/firebase'


const useStyles = makeStyles({
  list: {
    width: 300
  },
  input: {
    display: 'none',
  },
});

export default function SwipeableTemporaryDrawer({title}) {
    const [src, setsrc] = useState('');
     const [username, setusername] = useState('');
     const [status, setstatus] = useState('');
     const [visibility, setVisibility] = useState({
         username: false,
         status : false
     });
     const userID = localStorage.getItem(LocalStorageVariables.USERID);
     const tokenID = localStorage.getItem(LocalStorageVariables.TOKEN);
     const [loading, setloading] = useState({
        username: false,
        status : false,
        src: false
     })
     const [error, setError] = useState({
       username : false,
       status: false
     })

    useEffect(() => {
       setsrc(localStorage.getItem(LocalStorageVariables?.PHOTOURL));
       setusername(localStorage.getItem(LocalStorageVariables?.USERNAME));
       setstatus(localStorage.getItem(LocalStorageVariables?.STATUS))
    }, [src])

  const classes = useStyles();
  const [state, setState] = React.useState({
    drawer: false,
  });

  const toggleDrawer = ( open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, drawer: open });
  };

  const handleChange  =  (e) => {
    setusername(e.target.value);
    setVisibility({...visibility ,username: true})
  };

  const handleChangeStatus  =  (e) => {
    setstatus(e.target.value);
    setVisibility({...visibility ,status: true})
  };

  const handleCancelStatus = () => {
    setVisibility({...visibility ,status: false})
    setstatus(localStorage.getItem(LocalStorageVariables?.STATUS))

  }
  const handleCancelUsername = () => {
    setusername(localStorage.getItem(LocalStorageVariables?.USERNAME));
    setVisibility({...visibility ,username: false})

 }

 const handleSubmitStatus = () => {
   if(status !== ""){
    setVisibility({...visibility ,status: false});
    setloading({...loading, status: true});
    axios.put(`/users/update/${userID}`, {
      status: status
   }, {
     headers: {
       "auth-token": tokenID
     }
   }).then( res => {
       setloading({...loading, status: false})
       localStorage.setItem(LocalStorageVariables.STATUS , status);
   }).catch(err => {
       console.log(err)
       setloading({...loading, status: false})
   })}
   else{
          setError({...error, status: true})
   }
 }

 const handleSubmitUsername = () => {
   console.log(username)
    if(username !== ""){
         setVisibility({...visibility ,username: false})
         setloading({...loading, username: true})
     axios.put(`/users/update/${userID}`, {
        username: username
     }, {
       headers: {
         "auth-token": tokenID
       }
     }).then( res => {
         console.log(res)
         localStorage.setItem(LocalStorageVariables.USERNAME , username);
          setloading({...loading, username: false})
     }).catch(err => {
         console.log(err)
         setloading({...loading, username: false})
     }) 
    }
    else{
      setError({...error, username: true})
    }
 }

 const handleUpload = (e) => {
  setloading({...loading, src: true});
  let file = e.target.files[0];
  const uploadTask = storage.ref(`images/${file.name}`).put(file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // progress function ...
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      console.log(progress)
    },
    (error) => {
      console.log(error);
    },
    () => {
      // complete function ...
      storage
        .ref("images")
        .child(file.name)
        .getDownloadURL()
        .then((url) => {
          setsrc(url);
          console.log(url)
           axios.put(`/users/update/${userID}`, {
              photoUrl : url
           },{
              headers: {
                 "auth-token": tokenID
            }
           }).then(() => {
              localStorage.setItem(LocalStorageVariables.PHOTOURL , url); 
              setsrc(url);
              setloading({...loading, src: false});
           })
        });
    }
  );
};

  return (
    <div className="profileDrawer">
        <React.Fragment >
          <div onClick={toggleDrawer(true)}>{title}</div>
          <Drawer
            open={state.drawer}
            onClose={toggleDrawer( false)}
          >
              <div 
                 className={clsx(classes.list)}
                 role="presentation"
              >
                <div className="profileDrawer">
                    <h2><IconButton onClick={toggleDrawer(false)}><ArrowIcon/> </IconButton>   Profile</h2>
                    <div className="profileDrawer__content">
                            <UploadImage handleUpload={handleUpload} tokenID={tokenID} userID={userID} srcUrl={src} postUrl={`/users/update/${userID}`} loading={loading.src} profile={true}/>
                            <div className="section">
                                <label>Your Name</label>
                                    <Input
                                    className="input"
                                    id="outlined-start-adornment"
                                    value={username}
                                    onChange={handleChange}
                                    endAdornment={  <InputAdornment position="end">
                                        {
                                            visibility.username && <div className="icons">
                                                <IconButton onClick={handleCancelUsername}> <Close/> </IconButton>
                                                <IconButton onClick={ handleSubmitUsername}> <Check/> </IconButton>
                                            </div>}
                                        { loading.username && <CircularProgress className="progress"   />}
                                    </InputAdornment>}
                                />
                                  {error.username && <div className="error">This field can't be empty</div>}
                            </div>
                            <div  className="section">
                                <p>This is your username. This name will be visible to all your chats</p>
                            </div>
                            <div  className="section">
                                <label>Status</label>
                                <Input
                                    className="input"
                                    id="outlined-start-adornment"
                                    value={status}
                                    onChange={handleChangeStatus}
                                    endAdornment={<InputAdornment position="end">
                                        { visibility.status && <div>
                                                  <IconButton onClick={handleCancelStatus}> <Close/> </IconButton>
                                                  <IconButton onClick={handleSubmitStatus }><Check/></IconButton>
                                        </div>
                                        }
                                      {   loading.status && <CircularProgress className="progress"   /> }
                                    </InputAdornment>}
                                />
                                {error.status && <div className="error">This field can't be empty</div>}
                            </div>
                        </div>
                    </div>
                </div>
          </Drawer>
        </React.Fragment>
    </div>
  );
}