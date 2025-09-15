"use client";

import "./main_page_nav.css"

import { useRouter } from 'next/navigation';
import { useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function Nav({ onNavigate }){

    const [anchorEl, setAnchorEl] = useState(null);

    const router = useRouter();
    const handleNavClick = (e) => {
        router.push("/login")
    }

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (which) => {
        setAnchorEl(null);

        if (which == "SignIn"){
            router.push("/login");
        } else if (which == "SignUp"){
            router.push("/login");
        }
    };

    return (
        <nav>
            <div className="logo-container">
                <img className="logo-img" src="/images/image.png" alt="MacroMaxer logo"/>
                <h2 className="logo">
                    <a href="/" className="dashboard-link">MacroMaxer</a>
                </h2>
            </div>
            <ul className="nav-list">
                <a onClick={onNavigate} className="profile-link">Features</a>
                <a href="/login" className="profile-link">Sign In</a>
                <button onClick={handleNavClick} className="nav-button-main">Sign Up</button>

                <div className="hamburger-container"
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <img className="hamburger" src="/images/hamburger.png" alt="hamburger icon"></img>
                </div>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{list: {'aria-labelledby': 'basic-button',},   }}
                >
                    <MenuItem onClick={() => {onNavigate(), handleClose("Features")}}>Features</MenuItem>
                    <MenuItem onClick={() => handleClose("SignIn")}>Sign In</MenuItem>
                    <MenuItem onClick={() => handleClose("SignUp")}>Sign Up</MenuItem>
                </Menu>
            </ul>        
        </nav>
    );
}