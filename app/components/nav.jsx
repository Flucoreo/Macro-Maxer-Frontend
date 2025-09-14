import "./nav.css"

import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { logout } from "../auth"

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function Nav({beginning_letter, user_credits}){

    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogOut = async () => {
        setAnchorEl(null);
        try {
            const res = await logout()
            res.status == 200 && router.push("/login");
        } catch (err) {
            console.log(err)
            alert(`Log out failed! ${err}`)
            return
        }
    }

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (which) => {
        setAnchorEl(null);

        if (which == "Profile"){
            router.push("/settings");
        } else if (which == "Account"){
            router.push("/account");
        }
    };

    return (
        <nav>
            <div className="logo-container">
                <img className="logo-img" src="/images/image.png" alt="Vitabuddy logo"/>
                <h2 className="logo">
                    <a href="/dashboard" className="dashboard-link">VitaBuddy</a>
                </h2>
            </div>
            <ul className="nav-list">
                <p className="credits-remaining">Credits Remaining: {user_credits && user_credits}</p>
                <div className="profile-icon"
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    {beginning_letter}
                </div>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{list: {'aria-labelledby': 'basic-button',},   }}
                >
                    <MenuItem onClick={() => handleClose("Profile")}>Profile</MenuItem>
                    <MenuItem onClick={() => handleClose("Account")}>My account</MenuItem>
                    <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </Menu>
                
                {/* <button><a ><img className="nav-list-profile" alt="profile image button" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1-KR6Au3t28_j9BUqtgYVE6RMSJehlF9oELnyCRRhBEhEfoVQNaphRe3MtatPvOjO0589GZM-tBEg78rEZcWbMc4aFbcDVLWF9fvPji-3Qsa8l0sjHakmK4nga6YgtxkpXQSJ9AhNKseDP3GJOMeKlBjxr9E4aT7nGFPsLIGsaUJZi8113vRYl4nBDzqzHQZj7RPYbwpObCwtss5H6AhZKdhUYryDQrn3vqgeI5D53wi1OmtNePeQ1ZqaH4zNiliBYtQTiyqgQoI"/></a></button> */}
            </ul>        
        </nav>
    );
}