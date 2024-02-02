import React, {useEffect, useState} from 'react';
import "./settings.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Settings = () => {
    const [username, setUsername] = useState(localStorage.getItem("user"))
    const id = localStorage.getItem("id")
    const token = localStorage.getItem("token")
    const navigate = useNavigate();
    const base_url = "http://localhost:8000/api";
    if (token === null){
        navigate("/")
    }

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [bio, setBio] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [connected, setConnected] = useState(true)

    const getUserInfo = ()=>{
        let url = base_url + "/users/"+id;
        axios.get(url)
            .then(r=> {
                if (r.status === 200) {
                    setFirstName(r.data.firstname)
                    setLastName(r.data.lastname)
                    setPhoneNumber(r.data.phone)
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

    const uploadImage = (file) =>{
        let url = base_url + "/files/upload/profile";
        const params = {token: token}
        const headers= {'Content-Type': 'multipart/form-data'};
        const formData = new FormData();
        formData.append('file', file);
        axios.post(url, formData,  { params: params, headers: headers })
            .then(r=> {
                if (r.status === 200) {
                    setProfileImage(base_url + "/files/download/" + r.data)
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

    const updateProfile = () => {
        let url = base_url + "/users/"+id;
        const headers= {'Content-Type': 'application/json'};
        const data = {
            firstname: firstName,
            lastname: lastName,
            username: username,
            password: password,
            phone: phoneNumber,
            image: profileImage,
            bio: bio,
            token: token,
        }
        axios.patch(url, data,  { headers: headers })
            .then(r=> {
                if (r.status === 200) {
                    navigate("/chat")
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
    
    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        uploadImage(file);
    };

    useEffect(() => {
        getUserInfo();
    }, []);
    
    return (
        <div className="settings-container">
            <h2>Profile Settings</h2>
            <div className="id-card">
                <div className="profile-pic-container">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile Preview"
                      className="profile-pic"
                    />
                  ) : (
                    <div className="default-pic">No Image</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePictureChange}
                    className="file-input"
                  />
                </div>
                <div className="info-container">
                    <label htmlFor="firstname">First Name:</label>
                    <input
                        type="text"
                        id="firstname"
                        value={firstName}
                        placeholder={"Your first name..."}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input-field"
                    />

                    <label htmlFor="lastname">Last Name:</label>
                    <input
                        type="text"
                        id="lastname"
                        value={lastName}
                        placeholder={"Your last name..."}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input-field"
                    />

                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        placeholder={"Your username..."}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        placeholder={"Your password..."}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />


                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        placeholder={"Your phone number..."}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="input-field"
                    />

                    <label htmlFor="bio">Bio:</label>
                    <textarea
                        id="bio"
                        value={bio}
                        placeholder={"Write about yourself..."}
                        onChange={(e) => setBio(e.target.value)}
                        className="input-field"
                    />


                </div>
            </div>
            <button onClick={updateProfile} className="save-button">
                Save Profile
            </button>
        </div>
    );
};

export default Settings;