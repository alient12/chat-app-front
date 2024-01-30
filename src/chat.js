import React from "react";
// import {useNavigate} from "react-router-dom";
// import axios from 'axios';
import Modal from 'react-modal';
import "./chat.css"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import Typekit from 'react-typekit';
import axios from "axios";
import {useNavigate} from "react-router-dom";
try{Typekit.load({async: true});}catch(e){}
Modal.setAppElement('#root')


const base_url = "http://localhost:8000/api";

class Contact extends React.Component{
    constructor(props) {
        super(props);
        this.state = {name:this.props.name, lastMessage:this.props.lastMessage, status:this.props.status, profileImage:this.props.profileImage, activeContact:null}
        this.onClick = this.onClick.bind(this);
        this.setActiveContact = this.setActiveContact.bind(this);
    }


    onClick(){
        this.props.activeContactHandler(this.props.index)
    }

    setActiveContact(key){
        this.setState({activeContact:key})
    }

    render(){
        return(
            <li className={this.state.activeContact===this.props.index ? 'contact active' : 'contact'} onClick={this.onClick}>
                <div className="wrap">
                    <span className={"contact-status "+ this.state.status}></span>
                    <img src={this.state.profileImage} alt=""/>
                    <div className="meta">
                        <p className="name">{this.state.name}</p>
                        <p className="preview">{this.state.lastMessage}</p>
                    </div>
                </div>
            </li>
        )
    }
}

class Contacts extends React.Component{
    constructor(props) {
        super(props);
        // this.state = {contacts:this.props.contacts}
        this.activeContactHandler = this.activeContactHandler.bind(this)
        this.contacts = this.props.contacts.map((_,__)=>{return React.createRef();})
        this.state = {contacts:this.props.contacts.map((contact, i)=>{
            return <Contact key={this.state.contacts[i]} ref={this.contacts[i]} index={i} name={contact.name} lastMessage={contact.lastMessage} status={contact.status} profileImage={contact.profileImage} activeContactHandler={this.activeContactHandler}/>
        })}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.value !== this.props.value) {
            this.setState({contacts: this.props.contacts});
            console.log(this.state.contacts)
        }
    }


    activeContactHandler(key){
        this.contacts.forEach((contact, _)=>(contact.current.setActiveContact(key)))
    }

    render(){
        let element
        if (this.state.contacts.length === 0){
            element = "<p> FUCK YOU! Create a contact<p/>";
        }else{
            element = this.state.contacts
        }
        return (
            <div key={this.props.contacts} id="contacts">
                <ul>
                    {element}
                </ul>
            </div>
        )
    }
}

class Profile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {status:"online", name:this.props.name, profileImage:this.props.profileImage}
    }


    statusOnClick(val){
        this.setState({status:val})
    }

    render(){
        return (
            <div id="profile">
                <div className="wrap">
                    <img id="profile-img" src={this.state.profileImage} className={this.state.status} alt=""/>
                    <p>{this.state.name}</p>
                    <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                    <div id="status-options">
                        <ul>
                            <li id="status-online" className={this.state.status === "online"?"active":""} onClick={()=>this.statusOnClick("online")}><span className="status-circle"></span><p>Online</p></li>
                            <li id="status-away" className={this.state.status === "away"?"active":""} onClick={()=>this.statusOnClick("away")}><span className="status-circle"></span> <p>Away</p></li>
                            <li id="status-busy" className={this.state.status === "busy"?"active":""} onClick={()=>this.statusOnClick("busy")}><span className="status-circle"></span> <p>Busy</p></li>
                            <li id="status-offline" className={this.state.status === "offline"?"active":""} onClick={()=>this.statusOnClick("offline")}><span className="status-circle"></span> <p>Offline</p></li>
                        </ul>
                    </div>
                    <div id="expanded">
                        <label htmlFor="twitter"><i className="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="mikeross"/>
                        <label htmlFor="twitter"><i className="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="ross81"/>
                        <label htmlFor="twitter"><i className="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="mike.ross"/>
                    </div>
                </div>
            </div>
        )
    }
}

class Search extends React.Component{
    render(){
        return (
            <div id="search">
                <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                <input type="text" placeholder="Search contacts..."/>
            </div>
        )
    }
}

class BottomBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = { isModalOpen: false };
        this.onAddContactButton = this.onAddContactButton.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }
    onAddContactButton(){
        this.setState({ isModalOpen: true });
    }

    closeModal(){
        this.setState({ isModalOpen: false });
    }

    render(){
        return (
            <div id="bottom-bar">
                <button id="addcontact" onClick={this.onAddContactButton}><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i>
                    <span>Add contact</span></button>
                <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span>
                </button>
                <CreateContact isOpen={this.state.isModalOpen} closeModal={this.closeModal}/>
            </div>
        )
    }
}

class CreateContact extends React.Component{
    constructor(props) {
        super(props);
        this.state = { contacts: [], keyword:"" };
        this.searchUser = this.searchUser.bind(this)
        this.addChat = this.addChat.bind(this)
    }

    searchUser(){
        if (this.state.keyword !== ""){
            const url = base_url + "/users";
            axios.get(url, { params: { keyword: this.state.keyword } })
                .then(r=> {
                    if (r.status === 200) {
                        let contacts = r.data.map((data,_)=>{return {id:data.id, username:data.username, firstName:data.firstname, lastName:data.lastname}})
                        console.log(contacts)
                        this.setState({contacts:contacts})
                    } else {
                        window.alert("cannot connect to server")
                        this.setState({connected: false})
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({connected: false})
                })
            }
    }

    addChat(index){
        const url = base_url + "/chats";
        const headers = {'Content-Type': 'application/json'};
        const data = {
            token: localStorage.getItem("token"),
            people:[this.state.contacts[index].id, Number(localStorage.getItem("id"))]
        };
        axios.post(url, data, {headers: headers})
            .then(r=> {
                if (r.status === 200) {
                    this.props.closeModal()
                } else {
                    window.alert("cannot connect to server")
                    this.setState({connected: false})
                }
            })
            .catch((error) => {
                console.error(error);
                this.props.closeModal()
            })

    }

    render() {
        return (
            <Modal id="add-contact" className="sidepanel-style" isOpen={this.props.isOpen}>
                <h2>Add New Contact</h2>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                    onClick={() => {
                                        this.props.closeModal()
                                    }}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div id="search">
                            <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                            <input type="text" placeholder="Search contacts..." onChange={ev => {
                                this.setState({keyword: ev.target.value})
                                this.searchUser()
                            }}/>
                        </div>
                        <div id="contacts">
                            <ul>
                                {this.state.contacts.map((contact, index) => (
                                    <li key={index} className='contact' onClick={() => this.addChat(index)}>
                                        <div className="wrap">
                                            {/*<span className={"contact-status " + contact.status}></span>*/}
                                            {/*<img src={contact.profileImage} alt=""/>*/}
                                            <div className="meta">
                                                <p className="name">{contact.firstName + " " + contact.lastName}</p>
                                                <p className="preview">{contact.username}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

class SidePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contacts: this.props.contacts, profile: this.props.profile}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.value !== this.props.value) {
            this.setState({contacts: this.props.contacts});
        }
    }

    render() {
        return (
            <div key={this.props.key} id="sidepanel" className="sidepanel-style">
                <Profile name={this.state.profile.name} profileImage={this.state.profile.profileImage}/>
                <Search/>
                <Contacts key={this.props.key} contacts={this.state.contacts}/>
                <BottomBar/>
            </div>
        )
    }
}

class ContactProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: this.props.name, profileImage: this.props.profileImage}
    }


    render(){
        return (
            <div className="contact-profile">
                <img src={this.state.profileImage} alt=""/>
                <p>{this.state.name}</p>
                <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                </div>
            </div>
        )
    }
}

class Message extends React.Component{
    render(){
        return (
            <li className={this.props.messageType}>
                <img src={this.props.profileImage} alt=""/>
                <p>{this.props.message}</p>
            </li>
        )
    }
}

class Messages extends React.Component{
    constructor(props) {
        super(props);
        this.state = {messages:this.props.messages}
    }


    render(){
        let element
        if (this.state.messages.length === 0){
            element = "<p> FUCK YOU! No message found<p/>";
        }else{
            element = this.state.messages.map((message, i)=>{
                return <Message message={message.message} profileImage={message.profileImage} messageType={message.messageType}/>
            })
        }
        return (
            <div className="messages">
                <ul>
                    {element}
                </ul>
            </div>
        )
    }
}

class MessageInput extends React.Component{
    constructor(props) {
        super(props);
        this.state = {messages:""}
        this.buttonOnClick = this.buttonOnClick.bind(this);
    }


    buttonOnClick(){
        this.setState({message:document.getElementById("message-input").value})
        console.log(this.state.message)
        document.getElementById("message-input").value = ""
    }

    render(){
        return (
            <div className="message-input">
                <div className="wrap">
                    <input id="message-input" type="text" placeholder="Write your message..."/>
                    <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                    <button className="submit" onClick={this.buttonOnClick}><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
                </div>
            </div>
        )
    }
}

class Content extends React.Component{
    constructor(props) {
        super(props);
        this.state = {contact:null, messages:this.props.messages}
    }


    render(){
        return (
            <div className="content">
                <ContactProfile name={"Mamad"} profileImage={"http://emilcarlsson.se/assets/harveyspecter.png"}/>
                <Messages messages={this.state.messages}/>
                <MessageInput/>
            </div>
        )
    }
}

class Chat extends React.Component{

    constructor(props) {
        super(props);
        this.state = {loggedIn:this.props.loggedIn, username:localStorage.getItem('user'), ID:localStorage.getItem('id'), profile:null, connected:false, contacts:[]}
        this.getUserInfo = this.getUserInfo.bind(this)
        this.getUserChats = this.getUserChats.bind(this)
        this.getOtherUserInfo = this.getOtherUserInfo.bind(this)
        this.getLastMessage = this.getLastMessage.bind(this)
        this.updateContacts = this.updateContacts.bind(this)
    }

    componentDidMount() {
        this.getUserInfo()
        setInterval(this.updateContacts, 1000)
    }

    getUserInfo(){
        const url = base_url + "/users/"+this.state.ID;
        axios.get(url)
            .then(r=> {
                if (r.status === 200) {
                    this.setState({
                        profile: {
                            name: r.data.firstname + " " + r.data.lastname,
                            profileImage: r.data.image
                        },
                        connected:true
                    })
            } else {
                window.alert("cannot connect to server")
                this.setState({connected: false})
            }
        })
        .catch((error) => {
                console.error(error);
            this.setState({connected: false})
            })
        }

    getUserChats(){
        const url = base_url + "/chats";
        return axios.get(url, { params: { token: localStorage.getItem("token") } })
            .then(r => {
                if (r.status === 200){
                    let contacts = []
                    r.data.forEach((chat, _)=>{
                        let id = chat.people[0]
                        if (chat.people[0] == localStorage.getItem("id")){
                            id = chat.people[1]
                        }
                        this.getOtherUserInfo(id).then(contact => {
                            if (contact == null){
                                return
                            }
                            this.getLastMessage(chat.id).then(lastMessage=>{
                                contact.lastMessage = lastMessage
                                contacts.push(contact)
                            })
                        })

                    })
                    return contacts
                }
                else{
                    window.alert("cannot connect to server")
                }
        })
            .catch((error) => {
            })
    }

    getOtherUserInfo(id){
        const url = base_url + "/users/"+id;
        return axios.get(url)
            .then(r=> {
                if (r.status === 200) {
                    return {
                        name: r.data.firstname + r.data.lastname,
                        status:"offline",
                        lastMessage:"",
                        profileImage: r.data.image
                    }

                } else {
                    window.alert("cannot connect to server")
                    this.setState({connected: false})
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }

    getLastMessage(chatID){
        const url = base_url + "/chats/"+chatID;
        return axios.get(url, { params: { token: localStorage.getItem("token") } })
            .then(r=> {
                if (r.status === 200) {
                    if (r.data.messages == null){
                        return ""
                    } else{
                        return r.data.messages[0].content
                    }
                } else {
                    window.alert("cannot connect to server")
                    this.setState({connected: false})
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }

    updateContacts(){
        this.getUserChats().then(x => {
            this.setState({contacts:x})
        })
    }

    render(){
        let contact3 = {
            name: "gholi",
            lastMessage: "Fuck you!",
            status: "busy",
            profileImage:"https://emilcarlsson.se/assets/rachelzane.png"
        }
        let contact2 = {
            name: "abbas",
            lastMessage: "Hi",
            status: "away",
            profileImage:"https://emilcarlsson.se/assets/danielhardman.png"
        }
        let contact1 = {
            name: "Mamad",
            lastMessage: "You:Fuck You Mamad! Fuck You Mamad!",
            status: "online",
            profileImage:"https://emilcarlsson.se/assets/harveyspecter.png"
        }
        let contact4 = {
            name: "Ali",
            lastMessage: "What's up Jzein?",
            status: "online",
            profileImage:"https://e1.pxfuel.com/desktop-wallpaper/147/865/desktop-wallpaper-anime-profile-pic-anime-profile.jpg"
        }
        let contacts = [contact1, contact2, contact3, contact4]


        let message1 = {
            message: "Fuck You Javad!",
            messageType: "replies",
            profileImage: "https://emilcarlsson.se/assets/harveyspecter.png",
        }
        let message2 = {
            message: "Fuck You Mamad!",
            messageType: "sent",
            profileImage: "https://emilcarlsson.se/assets/donnapaulsen.png",
        }
        let message3 = {
            message: "Fuck You Javad! Fuck You Javad! Fuck You Javad! Fuck You Javad! Fuck You Javad! Fuck You Javad!",
            messageType: "replies",
            profileImage: "https://emilcarlsson.se/assets/harveyspecter.png",
        }
        let message4 = {
            message: "Fuck You Mamad! Fuck You Mamad! Fuck You Mamad! Fuck You Mamad! Fuck You Mamad! Fuck You Mamad!",
            messageType: "sent",
            profileImage: "https://emilcarlsson.se/assets/donnapaulsen.png",
        }
        let messages = [message1, message2, message3, message4]

        if (this.state.connected && this.state.contacts !== []){
            return (
                <div id="frame">
                    <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300' rel='stylesheet'
                          type='text/css'/>

                    <link rel='stylesheet prefetch'
                          href='https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css'/>
                    <link rel='stylesheet prefetch'
                          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.2/css/font-awesome.min.css'/>
                    <SidePanel key={this.state.contacts} contacts={this.state.contacts} profile={this.state.profile}/>
                    <Content messages={messages}/>
                </div>
            )
        }else{
            return <div>
                <h1>Connecting to server ...</h1>
            </div>
        }
    }
}

export default Chat