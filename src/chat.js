import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket"
import axios from 'axios';
import "./chat.css"
import Typekit from 'react-typekit';
import Modal from "react-modal";
try{Typekit.load({async: true});}catch(e){}
Modal.setAppElement('#root')

const Chat = (props) => {
    const username = localStorage.getItem("user")
    const id = localStorage.getItem("id")
    const token = localStorage.getItem("token")
    const navigate = useNavigate();
    const base_url = "http://localhost:8000/api";
    if (token === null){
        navigate("/")
    }

    const [name, setName] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [status, setStatus] = useState("online")
    const [connected, setConnected] = useState(true)

    const [contactProfileImage, setContactProfileImage] = useState("")
    const [contactName, setContactName] = useState("")
    const [contactID, setContactID] = useState("")
    const [contactStatus, setContactStatus] = useState("")
    const [chatID, setChatID] = useState("")
    const [contacts, setContacts] = useState([])
    const [messages, setMessages] = useState([])

    const [contactsHtml, setContactsHtml] = useState([])
    const [messagesHtml, setMessagesHtml] = useState([])
    const [activeContactIndex, setActiveContactIndex] = useState("")

    const ws_url = "ws://localhost:8000/api/message?token="+token
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        ws_url,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchedUsers, setSearchedUsers] = useState([])
    const lastMessageRef = useRef(null);
    const [refreshCount, setRefreshCount] = useState(0)

    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const addContactButton = (userID)=>{
        const url = base_url + "/chats";
        const headers = {'Content-Type': 'application/json'};
        const data = {
            people:[Number(id), Number(userID)],
            token: token
        };
        console.log(data)
        axios.post(url, data, {headers: headers})
            .then(r=> {
                if (r.status === 200) {
                    setIsModalOpen(false)
                    getUserChats()
                } else {
                }
            })
            .catch((error) => {
                console.error(error);
                setIsModalOpen(false)
            })
    }

    const getUserInfo = ()=>{
        let url = base_url + "/users/"+id;
        axios.get(url)
            .then(r=> {
                if (r.status === 200) {
                    setName(r.data.firstname + " " + r.data.lastname)
                    setProfileImage(r.data.image)
                    setConnected(true)
                } else {
                    setConnected(false)
                }
            })
            .catch((error) => {
                console.error(error);
                setConnected(false)
            })
    }

    const getOtherUserInfo = (id) => {
        let url = base_url + "/users/"+id;
        return axios.get(url)
            .then(r=> {
                if (r.status === 200) {
                    return {
                        name: `${r.data.firstname} ${r.data.lastname}`,
                        status:"offline",
                        lastMessage:"",
                        profileImage: r.data.image
                    }

                } else {
                    setConnected(false)
                }
            })
            .catch((error) => {
                console.error(error);
                setConnected(false)
            })
    }

    const getLastMessage = (chatID) => {
        let url = base_url + "/chats/"+chatID;
        return axios.get(url, { params: { token: token } })
            .then(r=> {
                if (r.status === 200) {
                    let messages = r.data.Messages
                    if (messages == null){
                        return ""
                    } else{
                        return messages[messages.length - 1]
                    }
                } else {
                    setConnected(false)
                }
            })
            .catch((error) => {
                console.error(error);
                setConnected(false)
            })
    }

    const getMessages = () => {
        if (chatID !== ""){
            let url = base_url + "/chats/"+chatID;
            return axios.get(url, { params: { token: token } })
                .then(r=> {
                    if (r.status === 200) {
                        setMessages(r.data.Messages)
                    } else {
                        setConnected(false)
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setConnected(false)
                })
        } else {
            setMessages([])
        }
    }

    const getUserChats = () => {
        let url = base_url + "/chats";
        return axios.get(url, { params: { token: token } })
            .then(r => {
                if (r.status === 200){
                    let promises = r.data.map((chat, _)=>{
                        let contact_id = chat.people[0]
                        let chat_id = chat.id
                        if (chat.people[0].toString() === id){
                            contact_id = chat.people[1]
                        }
                        return getOtherUserInfo(contact_id).then(contact => {
                            if (contact == null){
                                return
                            }
                            return getLastMessage(chat.id).then(lastMessage=>{
                                contact.lastMessage = lastMessage.content
                                contact.chatID = chat_id
                                contact.id = contact_id
                                contact.lastMessageTime = lastMessage.createdat
                                getOtherUserStatus(contact_id).then(contactStatus=>{
                                    contact.status = contactStatus
                                })
                                return contact
                            })
                        })
                    })
                    return Promise.all(promises).then(contacts => {
                        contacts.sort((a, b) => {
                            let dateA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
                            let dateB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);

                            if (dateA < dateB) {
                                return 1;
                            }
                            if (dateA > dateB) {
                                return -1;
                            }
                            return 0;
                        });
                        setContacts(contacts)
                        return contacts
                    })
                }
                else{
                    setConnected(false)
                }
            })
            .catch((error) => {
                console.error(error)
                setConnected(false)
            })
    }

    const getOtherUserStatus = (id) => {
        let url = base_url + "/status";
        return axios.get(url, { params: { token: token, id: id } })
            .then(r => {
                if (r.status === 200){
                    if (r.data){
                        return "online"
                    }else{
                        return ""
                    }
                }
                else{
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const renderContacts = () => {
        if (contacts.length !== 0){
            let html = []
            contacts.forEach((contact, i) => {
                let key = `contact-${contact.name}`
                html.push(
                    <li key={key} className={key === activeContactIndex? 'contact active' : 'contact'}
                        onClick={()=>{contactIndexHandler(key, contact.chatID, contact.name, contact.profileImage, contact.id, contact.status)}}>
                        <div className="wrap">
                            <span className={"contact-status " + contact.status}></span>
                            <img src={contact.profileImage} alt=""/>
                            <div className="meta">
                                <p className="name">{contact.name}</p>
                                <p className="preview">{ contact.lastMessage!= null && contact.lastMessage.length > 30 ? contact.lastMessage.slice(0,30)+"..." : contact.lastMessage}</p>
                            </div>
                        </div>
                    </li>
                )
            })
            setContactsHtml(html)
        }
    }

    const renderMessages = () => {
        if (messages != null && messages.length !== 0){
            let html = []
            messages.forEach((message, i) => {
                let key = `message-${message.id}`
                let messageType = "replies"
                let image = contactProfileImage
                if (message.sender.toString() === id){
                    messageType = "sent"
                    image = profileImage
                }
                if (i === messages.length - 1) {
                    html.push(
                        <li key={key} className={messageType} ref={lastMessageRef}>
                            <img src={image} alt=""/>
                            <p>{message.content}</p>
                        </li>
                    )
                } else {
                    html.push(
                        <li key={key} className={messageType}>
                            <img src={image} alt=""/>
                            <p>{message.content}</p>
                        </li>
                    )
                }
            })
            setMessagesHtml(html)
        } else if (messages != null && messages.length === 0){
            if (chatID !== ""){
                let html = [<li className="sent" ref={lastMessageRef}><p style={{width: '100%'}}>Start chatting with {contactName}!</p></li>]
                setMessagesHtml(html)
            } else {
                let html = [<li className="sent" ref={lastMessageRef}><p style={{width: '100%'}}>Select a chat to start messaging</p></li>]
                setMessagesHtml(html)
            }
        } else if (messages == null && chatID !== ""){
            let html = [<li className="sent" ref={lastMessageRef}><p style={{width: '100%'}}>Start chatting with {contactName}!</p></li>]
            setMessagesHtml(html)
        }
    }

    const contactIndexHandler = (key, chatID, name, image, id, status) => {
        setActiveContactIndex(key)
        setChatID(chatID)
        setContactName(name)
        setContactProfileImage(image)
        setContactID(id)
        setContactStatus(status)
    }

    const sendMessage = () => {
        let text = document.getElementById('message-input').value
        if (text !== ""){
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({
                    chatid: chatID,
                    receiver: contactID,
                    content: text,
                    contenttype: 0,
                })
            }
            document.getElementById('message-input').value = ""
        }
    }

    const updateContactsList = (chatID, message) => {
        let newContacts = [...contacts]
        newContacts.forEach((contact, i) => {
            if (contact.chatID === chatID){
                newContacts[i].lastMessage = message.content
                newContacts[i].lastMessageTime = message.createdat
            }
        })
        newContacts.sort((a, b) => {
            let dateA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
            let dateB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);

            if (dateA < dateB) {
                return 1;
            }
            if (dateA > dateB) {
                return -1;
            }
            return 0;
        });
        setContacts(newContacts)
    }

    const searchUser = () => {
        let text = document.getElementById('search-user-input').value
        if (text !== ""){
            const url = base_url + "/users";
            axios.get(url, { params: { keyword: text } })
                .then(r=> {
                    if (r.status === 200) {
                        let users = r.data.map((data,_)=>{return {
                            id:data.id, username:data.username, firstName:data.firstname, lastName:data.lastname,
                            profileImage: data.image,
                        }})
                        setSearchedUsers(users)
                    } else {
                        setConnected(false)
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setConnected(false)
                })
        }
    }

    useEffect(() => {
        getUserInfo();
        getMessages();
        getUserChats();
    }, []);

    useEffect(() =>{
        renderContacts();
    }, [contacts, activeContactIndex, refreshCount])

    useEffect(() => {
        getMessages();
    }, [chatID]);

    useEffect(() =>{
        renderMessages();
        setTimeout(scrollToBottom, 0)
    }, [messages])


    // Run when a new WebSocket message is received (lastJsonMessage)
    useEffect(() => {
        if (lastJsonMessage != null && "id" in lastJsonMessage){
            if (messages != null && messages.length !== 0){
                let newMessages = [...messages, lastJsonMessage]
                setMessages(newMessages)
            }else{
                let newMessages = [lastJsonMessage]
                setMessages(newMessages)
            }
            updateContactsList(lastJsonMessage.chatid, lastJsonMessage)
        }
    }, [lastJsonMessage])

    useEffect(() => {
        const intervalID = setInterval(() => {setRefreshCount(refreshCount + 1)}, 1000)
        return () => {clearInterval(intervalID)}
    }, []);


    return (
        <div id="frame">
            <div id="sidepanel" className="sidepanel-style">
                <div id="profile">
                    <div className="wrap">
                        <img id="profile-img" src={profileImage} className={status} alt=""/>
                            <p>{name}</p>
                            <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                            <div id="status-options">
                                <ul>
                                    <li id="status-online" className={status === "online" ? "active" : ""}
                                        onClick={() => this.statusOnClick("online")}><span className="status-circle"></span>
                                        <p>Online</p></li>
                                    <li id="status-away" className={status === "away" ? "active" : ""}
                                        onClick={() => this.statusOnClick("away")}><span className="status-circle"></span>
                                        <p>Away</p></li>
                                    <li id="status-busy" className={status === "busy" ? "active" : ""}
                                        onClick={() => this.statusOnClick("busy")}><span className="status-circle"></span>
                                        <p>Busy</p></li>
                                    <li id="status-offline" className={status === "offline" ? "active" : ""}
                                        onClick={() => this.statusOnClick("offline")}><span
                                        className="status-circle"></span> <p>Offline</p></li>
                                </ul>
                            </div>
                            <div id="expanded">
                                <label htmlFor="twitter"><i className="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
                                <input name="twitter" type="text"/>
                                <label htmlFor="twitter"><i className="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
                                <input name="twitter" type="text"/>
                                <label htmlFor="twitter"><i className="fa fa-instagram fa-fw"
                                                            aria-hidden="true"></i></label>
                                <input name="twitter" type="text"/>
                            </div>
                    </div>
                </div>

                <div id="search">
                    <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                    <input type="text" placeholder="Search contacts..."/>
                </div>

                <div id="contacts">
                    <ul>
                        {contactsHtml}
                    </ul>
                </div>

                <div id="bottom-bar">
                    <button id="addcontact" onClick={()=>{setIsModalOpen(true)}}><i className="fa fa-user-plus fa-fw"
                                                                          aria-hidden="true"></i>
                        <span>Add contact</span></button>
                    <button id="settings" onClick={() => {navigate("/settings")}}><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span>
                    </button>

                    <Modal id="add-contact" className="sidepanel-style" isOpen={isModalOpen}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <p>Add New Contact</p>
                                    <span aria-hidden="true" className="close" onClick={() => {
                                        setIsModalOpen(false)
                                    }}>&times;</span>
                                </div>
                                <div id="search">
                                    <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                                    <input id="search-user-input" type="text" placeholder="Search contacts..." onChange={ev => {
                                        searchUser(ev.target.value)
                                    }}/>
                                </div>
                                <div id="users">
                                    <ul>
                                        {searchedUsers.map((user, index) => (
                                            <li key={index} className='contact' onClick={() => addContactButton(user.id)}>
                                                <div className="wrap">
                                                    <img src={user.profileImage} alt=""/>
                                                    <div className="meta">
                                                        <p className="name">{user.firstName + " " + user.lastName}</p>
                                                        <p className="preview">{user.username}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>

            </div>

            <div className="content">

                <div className="contact-profile">
                    <img src={contactProfileImage} alt="" className={contactStatus}/>
                    <p>{contactName}</p>
                    <div className="social-media">
                        <i className="fa fa-camera" aria-hidden="true"></i>
                        <i className="fa fa-phone" aria-hidden="true"></i>
                        <i className="fa fa-apple" aria-hidden="true"></i>
                    </div>
                </div>

                <div className="messages">
                    <ul>
                        {messagesHtml}
                    </ul>
                </div>

                <div className="message-input">
                    <div className="wrap">
                        <input id="message-input" type="text" placeholder="Write your message..." onKeyPress={event => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                sendMessage();
                            }
                        }}/>
                        <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                        <button className="submit" onClick={sendMessage}><i className="fa fa-paper-plane"
                                                                            aria-hidden="true"></i></button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Chat
