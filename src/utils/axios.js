import axios from 'axios';


const instance = axios.create({
    baseURL: 'http://localhost:8080'
})

// https://whatsappclone25.herokuapp.com/

export default instance