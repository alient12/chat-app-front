import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [phone, setPhone] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [firstnameError, setFirstnameError] = useState("")
    const [lastnameError, setLastnameError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    
    const navigate = useNavigate();

    const base_url = "http://localhost:8000/api";
    const url = base_url + "/register";
    const headers = {'Content-Type': 'application/json'};

    // Log in a user using email and password
    const register = () => {
        const data = {
            "username": username,
            "password": password,
            "phone": phone,
            "firstname": firstname,
            "lastname": lastname
          };
        axios.post(url, data, {headers: headers})
        .then(r => {
            if (r.status === 200) {
                props.setLoggedIn(true)
                props.setUsername(r.data.Username)
                props.setID(r.data.ID)
                localStorage.setItem("user", username)
                localStorage.setItem("id", r.data.ID)
                localStorage.setItem("token", r.data.Token)
                navigate("/")
            } else {
                window.alert("something went wrong!")
            }
        })
        .catch((error) => {
            if (error.response){
                console.log(error.response.data.message)
                if (error.response.data.message === "username already exists"){
                    setUsernameError("Fuck! Someone else has already used this username.")
                }
                if (error.response.data.message === "phone number already exists"){
                    setPhoneError("Got you! You shall not pass the same phone number.")
                }
            }else{
                console.error(error);
            }
        })
    }
        
    const onButtonClick = () => {

        // Set initial error values to empty
        setUsernameError("")
        setPasswordError("")
        setPhoneError("")
        setFirstnameError("")
        setLastnameError("")

        // Check if the user has entered both fields correctly
        if ("" === username) {
            setUsernameError("Please enter your username")
            return
        }

        // if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        //     setEmailError("Please enter a valid email")
        //     return
        // }

        if ("" === password) {
            setPasswordError("Please enter a password")
            return
        }

        if (password.length < 8) {
            setPasswordError("The password must be 8 characters or longer")
            return
        }

        // Check if the user has entered both fields correctly
        if ("" === phone) {
            setPhoneError("Please enter your phone")
            return
        }

        if ("" === firstname) {
            setFirstnameError("Please enter your firstname")
            return
        }
        if ("" === lastname) {
            setLastnameError("Please enter your lastname")
            return
        }

        // Authentication calls will be made here... 
        register()
    }

    return <div className={"mainContainer"}>
        <div className={"titleContainer"}>
            <div>Register</div>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={username}
                placeholder="Enter your username here"
                onChange={ev => setUsername(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{usernameError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                type="password"
                value={password}
                placeholder="Enter your password here"
                onChange={ev => setPassword(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={phone}
                placeholder="Enter your phone here"
                onChange={ev => setPhone(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{phoneError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={firstname}
                placeholder="Enter your firstname here"
                onChange={ev => setFirstname(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{firstnameError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={lastname}
                placeholder="Enter your lastname here"
                onChange={ev => setLastname(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{lastnameError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={"Register"} />
        </div>
    </div>
}

export default Register