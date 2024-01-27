import React from "react"
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    const { loggedIn, username } = props
    const navigate = useNavigate();
    
    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user")
            localStorage.removeItem("id")
            localStorage.removeItem("token")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }
    const onRegisterButtonClick = () => {
        navigate("/register")
    }

    const startChatButtonClick = () => {
        navigate("/chat")
    }

    return <div className="mainContainer">
        <div className={"titleContainer"}>
            <div>Welcome!</div>
        </div>
        <div>
            This is the home page.
        </div>
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={loggedIn ? "Log out" : "Log in"} />
            {(!loggedIn ? <input
            className={"inputButton"}
            type="button"
            onClick={onRegisterButtonClick}
            value="Register"/> : <div/>)}
            {(loggedIn ? <div>
                <input
                className={"inputButton"}
                type="button"
                onClick={startChatButtonClick}
                value={"Start Chat"} />
                <div/>
                Your username is {username}
            </div> : <div/>)}
        </div>


    </div>
}

export default Home