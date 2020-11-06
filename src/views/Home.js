
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import React , { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useHistory} from 'react-router-dom';
import {LocalStorageVariables} from '../utils/localStorage';
import {Routes} from '../utils/routes';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import ChatDefaultView from '../components/ChatDefaultView';
import Loading from '../utils/Loading'


function App() {
const [chats, setchats] = useState([]);
const [loading, setLoading] = useState(false)
 var history = useHistory()

useEffect( () =>  {
  let ChatsMessages = []
  setLoading(true);
  async function fetctData(){
    const chats = await  axios.get('/users/getAll')
    const groups = await axios.get('/groups/getGroups');
    ChatsMessages = [...chats.data, ...groups.data];
    setchats(ChatsMessages);
    
  }
  fetctData()
  setLoading(false);
  console.log("loading")
}, []);



useEffect(() => {
  if(!localStorage.getItem(LocalStorageVariables.TOKEN)){
      history.push(Routes.signin);
  }
}, [history])


  return (
      <div className="app__body">
        <Loading openLoading={loading}/>
         <Sidebar chats={chats}/>
           <Switch>
             <Route  path="/user/:id/:type?" render={(props) => (<Chat {...props} />)}/>
             <Route path="/" component={ChatDefaultView}/>
             <Redirect from="*" to="/"/> 
          </Switch>
      </div>
   
  );
}

export default App;
