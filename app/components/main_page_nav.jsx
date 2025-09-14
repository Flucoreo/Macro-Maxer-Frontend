import "./main_page_nav.css"

import { useRouter } from 'next/navigation';

export default function Nav({ onNavigate }){

    const router = useRouter();
    const handleNavClick = (e) => {
        router.push("/login")
    }

    return (
        <nav>
            <div className="logo-container">
                <img className="logo-img" src="/images/image.png" alt="Vitabuddy logo"/>
                <h2 className="logo">
                    <a href="/" className="dashboard-link">VitaBuddy</a>
                </h2>
            </div>
            <ul className="nav-list">
                <a onClick={onNavigate} className="profile-link">Features</a>
                <a href="/login" className="profile-link">Sign In</a>
                <button onClick={handleNavClick} className="nav-button">Sign Up</button>
            </ul>        
        </nav>
    );
}