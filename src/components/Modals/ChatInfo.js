import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Avatar, Input,
     InputAdornment, IconButton, 
     Typography,Slide, Toolbar , 
     Divider , AppBar, List, ListItem, Dialog, CircularProgress, ListItemText} from '@material-ui/core';
import { LocalStorageVariables } from '../../utils/localStorage';
import UploadImage from '../Shared/UploadImage';
import Check from '@material-ui/icons/Check';
import {storage} from '../../utils/firebase'
import axios from '../../utils/axios'


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#fff"
    },
  appBar: {
    position: 'relative',
    backgroundColor: "#24cc63"
  },
  avatar:{
      width: 100,
      height: 100,
      border: "1px solid",
      margin: "20px auto"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  list: {
      marginLeft: 50,
      padding: 30
      
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function ChatInfo({chatInfo}) {
  const classes = useStyles();
  
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("")
  const [loading, setloading] = useState({
    username: false,
    description: false,
    src: false
  });
  const [visibility, setVisibility] = useState({
      username: false,
      description: false
  });

  const userID = localStorage.getItem(LocalStorageVariables.USERID); 
  const tokenID = localStorage.getItem(LocalStorageVariables.TOKEN);
  const postUrl = `/groups/update/${chatInfo?._id}`;


  useEffect(() => {
      setDescription(chatInfo?.description || chatInfo?.status);
      setUsername(chatInfo?.username || chatInfo?.groupName) 
      setSrc(chatInfo?.photoUrl); 
  }, [chatInfo])


  const handleSubmitStatus  =  () => {
    setVisibility({...visibility ,description: false});
    setloading({...loading, description: true})
    axios.put(postUrl, {
     description: description
   },{
     headers: {
        "auth-token": tokenID
    }
  }).then(() =>{
    setloading({...loading, description: false})
  })
  
  };

  const handleChangeStatus  =  (e) => {
    setDescription(e.target.value);
    setVisibility({...visibility ,description: true})
  };

  const handleCancelStatus = () => {
    setDescription(chatInfo?.description || chatInfo?.status);
    setVisibility({...visibility ,description: false})
  }

  const handleCancelUsername = () => {
    setVisibility({...visibility ,username: false});
    setUsername(chatInfo?.username || chatInfo?.groupName) 

  }
  const handleChangeUsername = (e) => {
       setUsername(e.target.value);
       setVisibility({...visibility ,username: true})
  }

  const handleSubmitUsername = () => {
    setVisibility({...visibility ,username: false});
    setloading({...loading, username: true})
    axios.put(postUrl, {
       groupName: username
    },{
      headers: {
         "auth-token": tokenID
     }
   }).then(() =>{
     setloading({...loading, username: false}) 
   })
    
  }
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

   const handleUpload = (e) => {
        console.log("uploading")
        setloading({...loading, src: true})
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
                setSrc(url);
                console.log(url)
                 axios.put(postUrl, {
                    photoUrl : url
                 },{
                    headers: {
                       "auth-token": tokenID
                  }
                 }).then(() => {
                    setSrc(url);
                    setloading({...loading, src: false});
                 })
              });
          }
        );
      };
  

  return (
    <div>
      <div  onClick={handleClickOpen}>
        Contact Info
      </div>
      <Dialog  fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
               {chatInfo?.groupName ? "Group Info" : "Contact Info"}
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List className="chatInfo" >
            {chatInfo?.createdBy === userID ? 
            <ListItem  className={classes.list}>
                 <UploadImage handleUpload={handleUpload} loading={loading.src}  srcUrl={src} /> 
            </ListItem>
              :   
             <ListItem >
                <Avatar className={classes.avatar} src={chatInfo?.photoUrl } alt={chatInfo?.username || chatInfo?.groupName}/>
            </ListItem> 
        }
               <Divider />
            <div className={classes.list}>
                {chatInfo?.createdBy === userID ? 
                <>
                  <Input
                  className="input"
                  id="outlined-start-adornment"
                  value={username}
                  onChange={handleChangeUsername}
                  endAdornment={
                     <InputAdornment position="end">
                      { visibility.username && <div>
                          <IconButton onClick={handleCancelUsername}> <CloseIcon/> </IconButton>
                          <IconButton onClick={handleSubmitUsername }><Check/></IconButton>
                      </div>
                      }
                      {   loading.username && <CircularProgress className="progress"   /> }
                    </InputAdornment>}
                    />
                     <ListItemText  secondary={`Created at ${chatInfo?.createdAt}`}/>
                
                    </>:
                 <ListItemText primary={chatInfo?.username || chatInfo?.groupName}  secondary={`Created at ${chatInfo?.createdAt}`}/>
                }
                
            </div>
            <Divider />
           
            <ListItem className={classes.list}>
                {chatInfo?.createdBy === userID ? 
                           <Input
                                className="input"
                                id="outlined-start-adornment"
                                value={description}
                                onChange={handleChangeStatus}
                                endAdornment={
                                   <InputAdornment position="end">
                                    { visibility.description && <div>
                                        <IconButton onClick={handleCancelStatus}> <CloseIcon/> </IconButton>
                                        <IconButton onClick={handleSubmitStatus }><Check/></IconButton>
                                    </div>
                                    }
                                    {   loading.description && <CircularProgress className="progress"   /> }
                                  </InputAdornment>}
                                /> :
               <> {chatInfo?.groupName ? 
                   <ListItemText primary="Description" secondary={chatInfo?.description} />  :
                   <ListItemText primary="Status" secondary={chatInfo?.status} />
                   }
                </>
                }
                
            </ListItem>
            <Divider />
            <ListItem className={classes.list}>
                {chatInfo?.username  &&  <ListItemText  primary="Phone Number" secondary={`${chatInfo?.telephone}`} />}
               
            </ListItem>
            <Divider />
           
        </List>
      </Dialog>
    </div>
  );
}
