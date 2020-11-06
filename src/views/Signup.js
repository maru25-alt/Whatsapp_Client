import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import axios from '../utils/axios';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { toast } from 'react-toastify';
import { useHistory} from 'react-router-dom'
import {LocalStorageVariables} from '../utils/localStorage'
import {Routes} from '../utils/routes';
import Loading from '../utils/Loading';

function Signup() {
    const { register, handleSubmit,errors } = useForm();
    const [username, setUsername] = useState('');
    const [telephone, setTelephone] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('')
    const [confirmError, setconfirmError] = useState(false)
    const [telephoneError, settelephoneError] = useState(false);
    const [openLoading, setopenLoading] = useState(false)
    const history = useHistory()

    const handleSubmitForm = () => {
        setconfirmError(false);
        settelephoneError(false);

         if(confirmPassword !== password){
             setconfirmError(true);
         }
         if(telephone === null){
             settelephoneError(true);
         }
         else{
            setopenLoading(true)
            const newUser = {
                username,
                telephone,
                password, 
            }
            console.log(newUser);
            axios.post('/users/signup' , newUser).then(res => {
                const response = res.data
                if(response.sucess){
                    setopenLoading(false)
                  localStorage.setItem(LocalStorageVariables.TOKEN, response.userToken);
                  localStorage.setItem(LocalStorageVariables.USERNAME, response.user.username);
                  localStorage.setItem(LocalStorageVariables.PHOTOURL, response.user.photoUrl);
                  localStorage.setItem(LocalStorageVariables.TELEPHONE, response.user.telephone);
                  localStorage.setItem(LocalStorageVariables.USERID, response.user._id);
                  localStorage.setItem(LocalStorageVariables.STATUS, response.user.status)
                  toast.success("account succefully created", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
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
            .catch(err => {
                console.log(err.message)
            })
         }  
    }

    useEffect(() => {
        if(localStorage.getItem(LocalStorageVariables.TOKEN)){
            history.push(Routes.home);
        }
       
    }, [history])


    return (
        <div className="sign__container">
             <Loading openLoading ={openLoading}/>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/WhatsApp_logo-color-vertical.svg/768px-WhatsApp_logo-color-vertical.svg.png" alt="logo"></img>
            <h5>Welcome to Whatspp</h5>
            <p>Create Account  </p>
            <p> Or already have an account  <a href="/signin">Signin</a> </p>
            <form onSubmit={handleSubmit(handleSubmitForm )}>
                <input type="username" name="username" placeholder="Username" ref={register({ required: true })} onChange={(e) => setUsername(e.target.value)}></input>
                {errors.username && <span className="error"> Username is required</span>}
                {/* <input type="tel" name="telephone" placeholder="Telephone" ref={register({ required: true })} onChange={(e) => setTelephone(e.target.value)}></input> */}
                <PhoneInput
                className="telephone"
                country={'us'}
                value={telephone}
                onChange={ e => setTelephone(e)}
                />
                {telephoneError && <span className="error"> Telephone number is required</span>}
                <input type="password" name="password" placeholder="Password" ref={register({ required: true , minLength: 6  })} onChange={(e) => setPassword(e.target.value)}></input>
                {errors.password && <span className="error"> At least 6 character password is required</span>}
                <input type="password" name="confirmPassword" placeholder="Confirm Password" ref={register({ required: true })} onChange={(e) =>  setconfirmPassword(e.target.value)}></input>
                {errors.confirmPassword && <span className="error"> This field is required</span>}
                {confirmError && <span className="error"> Password must match</span>}
               
                <button type="submit">Signup</button>
                <p>By clicking Signup you are agreeing to our terms and conditions</p>
            </form>
        </div>
    
    )
}

export default Signup
