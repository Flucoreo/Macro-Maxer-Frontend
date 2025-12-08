"use client";

import "./login.css"
import React from "react"
import {useState, useEffect} from "react"
import { useRouter } from 'next/navigation';
import {register, login, getUserInfo} from "../auth"

export default function Page(){

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showSignup, setShowSignup] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        repeatpassword: ""
    });

    // check email pattern
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    // check if a user is already logged in when they visit the login page
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserInfo()
                if (res.status == 200){
                    setMessage("You area already logged in! Redirecting to dashboard...");
                    setLoading(true);
                    router.push("/dashboard");
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchUser();
    }, [router]);

    // handle form inputs
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (showSignup){
            if (formData.username === "" || formData.email === "" || formData.password === "", formData.repeatpassword === ""){
                alert("Please fill in all form elements")
                setLoading(false);
                return
            }

            if (!isValidEmail(formData.email)){
                alert("Please provide a valid email address.")
                setLoading(false);
                return
            }

            if (formData.password != formData.repeatpassword){
                alert("Passwords must match!")
                setLoading(false);
                return
            }

            try {
                const res = await register(formData.username, formData.email, formData.password)
                if (res.status === 200){
                    setMessage("Registration successful! Redirecting to dashboard...");
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 1000);
                }
            } catch (err) {
                if (err.response?.status === 400){
                    setMessage("Email Aready in Use.");
                } else {
                    setMessage("Registration Failed.");
                }
                setLoading(false);
                return
            }

        } else {
            if (formData.email === "" || formData.password === ""){
                alert("Please fill in all form elements")
                setLoading(false);
                return
            }

            if (!isValidEmail(formData.email)){
                alert("Please provide a valid email address.")
                setLoading(false);
                return
            }

            try {
                const res = await login(formData.email, formData.password)
                if (res.status === 200){
                    setMessage("Login successful! Redirecting to dashboard...");
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 1000);
                }
            } catch (err) {
                setMessage("Invalid Username or password.");
                setLoading(false);
                return
            }
        }

        setFormData({
            username: "",
            email: "",
            password: "",
            repeatpassword: ""
        });
    };


    return (
        <>
        {/* <div className="logo-container-login">
            <img className="logo-img-login" src="/images/image.png" alt="MacroMaxer logo"/>
            <h2 className="logo-login">
                <a href="/" className="dashboard-link-login">MacroMaxer</a>
            </h2>
        </div> */}
        <div className="center-form">
            {message && <p className="login-message">{message}</p>}
            <div className="sign-form-container">

                
                    <h1 className="form-heading">{showSignup ? "Sign Up" : "Welcome Back"}</h1>
                    <form className="sign-form" onSubmit={handleSubmit}>

                        {showSignup &&
                            <label htmlFor="username" className="form-text">Username: </label>
                        }
                        {showSignup &&
                            <input type="text" id="username" name="username" className="form-fill" value={formData.username} onChange={handleChange}></input>
                        }       

                        <label htmlFor="email" className="form-text">Email: </label>
                        <input type="text" id="email" name="email" className="form-fill" value={formData.email} onChange={handleChange}></input>

                        <label htmlFor="password" className="form-text">Password: </label>
                        <input type="password" id="password" name="password" className="form-fill" value={formData.password} onChange={handleChange}></input>

                        {showSignup &&
                            <label htmlFor="repeatpassword" className="form-text">Repeat Password: </label>
                        }
                        {showSignup &&
                            <input type="password" id="repeatpassword" name="repeatpassword" className="form-fill" value={formData.repeatpassword} onChange={handleChange}></input>
                        }

                        <button type="submit" className="sign-in-up-button">{loading ? "Logging in..." : "Login"}</button>

                        <p className="create-account-text">{showSignup ? "Already a member?" :  "Not already a member?"} 
                            <a onClick={() => setShowSignup(prev => !prev)} className="member-text">{showSignup ? " Login" : " Create an account"}</a>
                        </p>
                    </form>

            </div>
        </div>
        </>
    )
}