import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const Login = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    
    const navigate = useNavigate();


    // Log in a user using email and password
    const base_url = "http://localhost:8000/api";
    const url = base_url + "/login";
    const headers = {'Content-Type': 'application/json'};

    const logIn = () => {
        const data = {
            "username": username,
            "password": password,
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
                window.alert("Wrong username or password")
            }
            console.log(r)
            console.log(document.cookie)
        })
        .catch((error) => {
            console.error(error);
        })
    }
        
    const onButtonClick = () => {

        // Set initial error values to empty
        setUsernameError("")
        setPasswordError("")

        // Check if the user has entered both fields correctly
        if ("" === username) {
            setUsernameError("Please enter your username")
            return
        }

        // if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)) {
        //     setUsernameError("Please enter a valid email")
        //     return
        // }

        if ("" === password) {
            setPasswordError("Please enter a password")
            return
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer")
            return
        }

        // Authentication calls will be made here... 
        logIn()
        // checkAccountExists(accountExists => {
        //     // If yes, log in 
        //     if (accountExists)
        //         logIn()
        //     else
        //     // Else, ask user if they want to create a new account and if yes, then log in
        //         if (window.confirm("An account does not exist with this email address: " + email + ". Do you want to create a new account?")) {
        //             logIn()
        //         }
        // })      
    }

    return <div className={"mainContainer"}>
        <div className={"titleContainer"}>
            <div>Login</div>
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
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={"Log in"} />
        </div>
    </div>
}

export default Login