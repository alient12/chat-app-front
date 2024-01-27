import React from "react";
// import {useNavigate} from "react-router-dom";
// import axios from 'axios';
import "./chat.css"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import Typekit from 'react-typekit';
try{Typekit.load({async: true});}catch(e){}

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
            return <Contact ref={this.contacts[i]} index={i} name={contact.name} lastMessage={contact.lastMessage} status={contact.status} profileImage={contact.profileImage} activeContactHandler={this.activeContactHandler}/>
        })}
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
            <div id="contacts">
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

    render(){
        return (
            <div id="bottom-bar">
                <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i>
                    <span>Add contact</span></button>
                <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span>
                </button>
            </div>
        )
    }
}

class SidePanel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {contacts:this.props.contacts, profile:this.props.profile}
    }

    render(){
        return (
            <div id="sidepanel">
                <Profile name={this.state.profile.name} profileImage={this.state.profile.profileImage}/>
                <Search/>
                <Contacts contacts={this.state.contacts}/>
                <BottomBar/>
            </div>
        )
    }
}

class ContactProfile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {name:this.props.name, profileImage:this.props.profileImage}
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

        let profile ={name:"Javad", profileImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c10a26e2-8af9-43b4-b871-1c7dbe15b650/dg6mv1w-afa02c47-38c3-4f35-8068-ff91d27b5d84.png/v1/fit/w_828,h_828/el_macho__despicable_me_2__by_totallynotincina_dg6mv1w-414w-2x.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2MxMGEyNmUyLThhZjktNDNiNC1iODcxLTFjN2RiZTE1YjY1MFwvZGc2bXYxdy1hZmEwMmM0Ny0zOGMzLTRmMzUtODA2OC1mZjkxZDI3YjVkODQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.b8XlS0Y3tzQIXLevbosNFX4TBwqiT6-ySF9o9FvB3sY"}

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

        return (
            <div id="frame">
                <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300' rel='stylesheet'
                      type='text/css'/>

                <link rel='stylesheet prefetch'
                      href='https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css'/>
                <link rel='stylesheet prefetch'
                      href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.2/css/font-awesome.min.css'/>
                <SidePanel contacts={contacts} profile={profile}/>
                <Content messages={messages}/>
            </div>
        )
    }
}

export default Chat