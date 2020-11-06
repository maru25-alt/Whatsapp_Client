import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {Avatar} from '@material-ui/core'
import { useForm } from "react-hook-form";
import DialogTitle from "@material-ui/core/DialogTitle";
import { toast } from 'react-toastify';
import axios from '../../utils/axios';
import {USERID} from '../../utils/localStorage';
import Loading from '../../utils/Loading'


export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { register, handleSubmit,errors } = useForm();
  const [loading, setLoading] = useState(false)
  
  const handleCreateGroup = () => {
       console.log('submited')
      setLoading(true);
       axios.post(`/groups/createGroup/${USERID}` , {
         name: title,
         description
       }).then( () => {
         setLoading(false)
         toast.success('Group successfully created', {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
         })
         setOpen(false)
       }).catch(err => {
         console.log(err)
       })
  }

  return (
    <div className="createGroup">
      <Loading openLoading={loading}/>
      <div onClick={() => setOpen(true)}>
        Create New Group
      </div>
      <Dialog className="createGroup__dialog" open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Group</DialogTitle>
         <form  className="createGroup__form">
            <DialogContent>
             <Avatar className="avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJDKsTk6Agd2U9vLQFMw162oFoHVuLPE-ixg&usqp=CAU" />
            <input
                name="title"
                placeholder="Title"
                type="text"
                ref={register({ required: true })}
                onChange={(e) => setTitle(e.target.value)}
            />
             {errors.title && <span className="error"> This field  is required</span>}
            <input
                name="description"
                placeholder="Description"
                type="text"
                ref={register({ required: true })}
                onChange={(e) => setDescription(e.target.value)}
            />
             {errors.description && <span className="error"> This field  is required</span>}
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={() => setOpen(false)} color="secondary">
                    Cancel
                </Button>
                <Button  onClick={handleSubmit(handleCreateGroup)}   color="primary">
                    Create
                </Button>
            </DialogActions>
          </form>
      
        
      </Dialog>
    </div>
  );
}