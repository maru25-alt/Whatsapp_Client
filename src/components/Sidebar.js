import React, { useEffect, useState } from 'react'
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { IconButton, Avatar} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SideBarChat from './SideBarChat';
import {LocalStorageVariables} from '../utils/localStorage'
import ProfileDrawer from './Modals/ProfileDrawer';
import Menu from './Modals/ProfileMenu';



function Sidebar({chats}) {
    const [src, setsrc] = useState('');

    useEffect(() => {
       setsrc(localStorage.getItem(LocalStorageVariables.PHOTOURL));
    }, [])

    // const handleSearchChange= (e) =>{
    //      //setChats(queryChats(e.target.value, Chats))
    //      console.log(queryChats(e.target.value, chats))

    // }

    // const queryChats = (search, arr)=>{
    //     console.log(arr);
    //     if(search){
    //         arr.filter(item => {
    //             console.log(item.username)
    //             return item.username === "rudo"
    //         })
    //     }
    //     else{
    //         return arr
    //     }
    // }
   

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <ProfileDrawer  title={<Avatar src={src}/>}/>
                <div className="header__icons">
                    <IconButton>
                        <DonutLargeIcon/>
                    </IconButton>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <Menu/>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="search__container">
                 <SearchIcon/>
                 <input  placeholder="search or start new" type="text"></input>
                </div>
            </div>
            <div className="sidebar__chats">
                {chats && chats.map(chat => {
                    return (<SideBarChat key={chat._id} chat={chat}/>)
                })}
                
            </div>
        </div>
    )
}

export default Sidebar
