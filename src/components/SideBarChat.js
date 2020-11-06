import { Avatar } from '@material-ui/core'
import React from 'react'
import {NavLink} from 'react-router-dom'


function SideBarChat({chat}) {

    const getLastMessage = (arr) => {
        const message = arr.shift()?.message
        return message
    }
    return (
        <NavLink  activeStyle={{ backgroundColor: '#dadbd3'}} to={`/user/${chat._id}/${chat?.groupName? 'group' : 'chat'}`} className="sidebar__chat">
            <Avatar src={chat.photoUrl}/>
            <div className="chat__info">
                <h2>{chat?.username || chat?.groupName}</h2>
                { chat.groupName ? <p>{getLastMessage(chat?.messages)}</p> :  <p> This is the last message...</p>} 
            </div>
        </NavLink>)
}
export default SideBarChat
