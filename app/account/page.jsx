"use client";

import "./page.css"
import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';

import Nav from "../components/nav"
import {refreshToken, changePassword, getUserInfo, deleteAccount} from "../auth"


export default function Page(){

    const router = useRouter();
    const [deleteAccountPassword, setDeleteAccountPassword] = useState("")
    const [userData, setUserData] = useState({
        username: "",
        useremail: "",
        credits: ""
    })
    const [passwordFormData, setPasswordFormData] = useState({
        oldpassword: "",
        password: "",
        repeatpassword: ""
    });


    // check if a user is already logged in when they visit the settings page, also get user nutrition preferences
    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            try {
                const userInfo = await getUserInfo();
                if (!isMounted) return;
                setUserData({username: userInfo.data.username, useremail: userInfo.data.useremail, credits: userInfo.data.credits});
            } catch (err) {
                // if user is not logged in, first try to get new access token with refresh token
                try {
                    await refreshToken();
                    const userInfo = await getUserInfo();
                    if (!isMounted) return;
                    setUserData({username: userInfo.data.username, useremail: userInfo.data.useremail, credits: userInfo.data.credits});
                } catch (err) {
                    router.push("/login");
                }
            }
        }

        fetchUser();
        return () => {
            isMounted = false;
        };
    }, [router]);

    // handle the password update form
    const handlePasswordChange = (e) => {
        setPasswordFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setPasswordFormData({
            oldpassword: "",
            password: "",
            repeatpassword: ""
        })

        if (passwordFormData.password != passwordFormData.repeatpassword){
            alert("Passwords must match!")
            return
        }

        try {
            const res = await changePassword(passwordFormData.oldpassword, passwordFormData.repeatpassword)
            alert("Password Changed Successfully.")
        } catch (error) {
            try {
                await refreshToken()
                const res = await changePassword(passwordFormData.oldpassword, passwordFormData.repeatpassword)
                alert("Password Changed Successfully.")
            } catch (error){
                if (error.status == "401"){
                    router.push("/login")
                } else {
                    alert("Failed to update password.")
                }
            }
        }
    }

    const handleDeleteAccountPassword = (e) => {
        setDeleteAccountPassword(e.target.value)
    }

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setDeleteAccountPassword("")

        try {
            const res = await deleteAccount(deleteAccountPassword)
            alert("Account Deleted Successfully.")
            router.push("/login")
        } catch (error) {
            try {
                await refreshToken()
                const res = await deleteAccount(deleteAccountPassword)
                alert("Account Deleted Successfully.")
                router.push("/login")
            } catch (error){
                if (error.status == "401"){
                    router.push("/login")
                } else {
                    alert("Failed to delete account.")
                }
            }
        }
    }

    // useEffect(() => {
    //     console.log("defaultData changed:", defaultData);
    // }, [defaultData]);

    
    return (
        <>
            {/* <p className={saveConfirmation == 'saved' ? "save-confirmation-show" : "save-confirmation"}>Saved Your Preferences!</p>
            <p className={saveConfirmation == 'saving' ? "save-confirmation-show" : "save-confirmation"}>Saving...</p> */}
            <Nav beginning_letter={userData.username == "" ? ".." : userData.username[0]} user_credits={userData.credits}/>

            <main className="container">
                <div className="form-container">
                    <div>
                        <h1 className="settings-title">My Account</h1>
                    </div>

                    <form className="profile-form" onSubmit={handleSubmitPassword}> 
                        <h2 className="settings-sub-title">Change Password</h2>

                        <div>
                            <label className="profile-input" htmlFor="oldpassword">Old Password: </label> <br/>
                            <input className="profile-input-text" type="text" name="oldpassword" value={passwordFormData.oldpassword} onChange={handlePasswordChange} placeholder=""/> 
                        </div>

                        <div>
                            <label className="profile-input" htmlFor="password">New Password: </label> <br/>
                            <input className="profile-input-text" type="text" name="password" value={passwordFormData.password} onChange={handlePasswordChange} placeholder=""/> 
                        </div>

                        <div>
                            <label className="profile-input" htmlFor="repeatpassword">Retype New Password: </label> <br/>
                            <input className="profile-input-text" type="text" name="repeatpassword" value={passwordFormData.repeatpassword} onChange={handlePasswordChange} placeholder=""/> 
                        </div>

                        <div className="submit-button-container">
                            <button type="submit" className="submit-button">Submit</button>
                        </div> 
                    </form>

                    <form className="profile-form" onSubmit={handleDeleteAccount}>
                        <h2 className="settings-sub-title">Delete Account</h2>

                        <div>
                            <label className="profile-input" htmlFor="deletePw">Enter Password to delete Account: </label> <br/>
                            <input className="profile-input-text" type="text" name="deletePw" value={deleteAccountPassword} onChange={handleDeleteAccountPassword} placeholder=""/> 
                        </div>

                        <div className="submit-button-container">
                            <button type="submit" className="delete-button">Delete Account</button>
                        </div> 
                    </form>
                </div>
            </main>
        </>
    );
}