import React, {useEffect, useState} from 'react'
import { IconButton, Avatar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicNoneIcon from '@material-ui/icons/MicNone';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import Message from './Message';
import axios from '../utils/axios';
import Axios from 'axios'
import Loading from '../utils/Loading';
import { USERID, USERNAME} from '../utils/localStorage';
import Pusher from '../utils/pusher';
import ChatMenu from './Modals/ChatMenu';
import loadingGif from '../css/img/loading.gif'

function Chat(props) {
    const [chat, setchat] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const chatId = props.match.params.id;
    const chatType = props.match.params.type
    const [loading, setloading] = useState(false)
    const [loadingNew, setloadingNew] = useState(false);
    const [messageError, setmessageError] = useState(false)

    useEffect( () =>  {
        setloading(true)
        if(chatType === 'group'){
            axios.get(`/groups/groupMessages/${chatId}`).then(res => {
                setchat(res.data);
                setMessages(res.data.messages)
                setloading(false)
           }).catch(err => {
               console.log(err);
               setloading(false)
           })
        }
        else{
             const getChatdata = () =>  axios.get(`/users/user/${chatId}`);
             const getMessages = () =>  axios.get(`/messages/userMessages/${USERID}/${chatId}`);
             Axios.all([getChatdata(), getMessages()])
                .then(Axios.spread(function (chat, messages) {
                    setchat(chat.data);
                    setMessages(messages.data);
                    setloading(false)
            })); 
        } 
    }, [chatId, chatType])

    useEffect(() => {
        let channel
        if(chatType === 'group'){
             channel = Pusher.subscribe("groups");
            channel.bind('insertedGroupMessage', function(data) {
                const newMessage =(data[Object.keys(data)[0]]);
                setMessages([...messages, newMessage[Object.keys(newMessage)[0]] ])
            });
        }
        else{
             channel = Pusher.subscribe('messages');
            channel.bind('InsertMessage', function(data){
             const newMessage =(data[Object.keys(data)[0]]);
             console.log(newMessage);
             setloadingNew(false);
             console.log("new");
             setMessages([...messages, newMessage[Object.keys(newMessage)[0]] ])
         });
        }
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
        
    }, [messages, chatType])

   const handleSubmitMessage = (e) => {
       e.preventDefault();
       setloadingNew(true)
       if(message !== ''){
           //send to group
           if(chatType === 'group'){
               axios.post(`/groups/newGroupMessage/${chatId}`, {
                senderId: USERID,
                message: message,
                username: USERNAME
               }).then( () => {
                 setloadingNew(false)
                 setMessage('');
               }).catch(err => {
                   console.log(err);
                   setmessageError(true)
                   setloadingNew(false)
               })
           }
           //send to chat
         else{
            axios.post(`/messages/newMessage/${USERID}/${chatId}`, {
                senderId: USERID,
                message: message
            }).then(res => {
                console.log(res)
                setMessage('');
                setloadingNew(false);
            }).catch(err =>{
                console.log(err)
                setloadingNew(false);
                setmessageError(true)
            })
           }   
       }
   }

    return (
        <div className="chat">
            <Loading  openLoading={loading}/>
            <div className="chat__header">
               <Avatar src={chat?.photoUrl}/>
               <div className="header__info">
               <h4>{chat?.username || chat?.groupName}</h4>
                 <p>Last seen today at 5:00am</p>
               </div>
               <div className="header__icons">
                   <IconButton>
                      <SearchIcon/>
                   </IconButton>
                   <IconButton>
                      <AttachFileIcon/>
                   </IconButton>
                  <ChatMenu chatInfo={chat}/>
               </div>
            </div>
            <div className="chat__body">
                { messages && messages.map(message => (
                     <Message key={message?._id} message={message}/>
                ))}
            </div>
            <div className="chat__footer">
                <div className="footer__iconsLeft">
                    <IconButton>
                        <SentimentVerySatisfiedIcon/>
                    </IconButton>
                <IconButton>
                    <AttachFileIcon/>
                </IconButton>
                </div>
                <form onSubmit={handleSubmitMessage} className="chat__input">
                    <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="Type a message..."></input>
                    <SearchIcon/>
                    {loadingNew && <img src={loadingGif} alt="loading" width="15" height="15"></img>}
                    {messageError && <div className="error">Message not sent!</div>}
                   
                </form>
               
                <div className="footer__iconsRight">
                    <IconButton>
                        <MicNoneIcon/>
                    </IconButton>
                </div>
               
            </div>
        </div>
    )
}

export default Chat
