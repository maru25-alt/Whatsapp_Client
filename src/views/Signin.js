import React , {useEffect, useState} from 'react'
import { useHistory} from 'react-router-dom'
import {LocalStorageVariables} from '../utils/localStorage'
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import {Routes} from '../utils/routes';
import axios from '../utils/axios';
import Loading from '../utils/Loading';


function Signin() {
    const history = useHistory();
    const { register, handleSubmit,errors } = useForm();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [openLoading, setopenLoading] = useState(false)

    const handleSubmitForm = () => {
        setopenLoading(!openLoading)
        axios.post('/users/signin' , {
            username,
            password
        }).then(res => {
            const response = res.data;
            console.log(response)
            if(response.sucess){
                localStorage.setItem(LocalStorageVariables.TOKEN, response.token);
                localStorage.setItem(LocalStorageVariables.USERNAME, response.user.username);
                localStorage.setItem(LocalStorageVariables.PHOTOURL, response.user.photoUrl);
                localStorage.setItem(LocalStorageVariables.TELEPHONE, response.user.telephone);
                localStorage.setItem(LocalStorageVariables.USERID, response.user._id);
                localStorage.setItem(LocalStorageVariables.STATUS, response.user.status);
                toast.success(" succefully loggedIn", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  });
                setopenLoading(false)
                history.push(Routes.home)

            }
            else{
                setopenLoading(false)
                toast.error( response.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            }
        })

    }
    useEffect(() => {
        if(localStorage.getItem(LocalStorageVariables.TOKEN)){
            history.push('/');
        }
    }, [history])

    return (
        <div className="signin">
           <Loading openLoading ={openLoading}/>
          <div className="sign__container">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/WhatsApp_logo-color-vertical.svg/768px-WhatsApp_logo-color-vertical.svg.png" alt="logo"></img>
            <h5>Signin to  Whatapp</h5>
            <p> Don't  have an account yet  <a href={Routes.signup}>Signup</a> </p>
            
            <form onSubmit={handleSubmit(handleSubmitForm )}>
                <input type="username" name="username" placeholder="Enter Username or Telephone " ref={register({ required: true })} onChange={(e) => setUsername(e.target.value)}></input>
                {errors.username && <span className="error"> This field  is required</span>}
                <input type="password" name="password" placeholder="Password" ref={register({ required: true  })} onChange={(e) => setPassword(e.target.value)}></input>
                {errors.password && <span className="error"> Password is required</span>}
                <button type="submit">Signin</button>
               
            </form>
           </div>
       </div>
    )
}

export default Signin
