import React from 'react'
import {USERID} from '../utils/localStorage'

function Message({message}) {
    const sender = message.SenderUserId === USERID || message.senderId === USERID
    return (
        <div className={`${sender ?  "message message__receiver" : "message"}`}>
             <span className="message__name">{message.username}</span>
             <span>{message.message}</span>
            <span className="message__timestamp"> {message.timestamp}</span>
        </div>
    )
}



export default Message
