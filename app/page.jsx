"use client";

import "./page.css"
import React from "react"
import { useRef } from "react";
import { useRouter } from 'next/navigation';

import Nav from "./components/main_page_nav"
import Footer from "./components/footer"

export default function Home() {
    const featuresRef = useRef(null);
    const router = useRouter();

    const handleNavigate = () => {
        featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleClick = (e) => {
        router.push("/dashboard")
    }

    return (
        <>
        <div className="screen-container">
            <Nav onNavigate={handleNavigate} />
            <div className="hero-img-containter">
                <img className="hero-img" src="/images/lettuce3.jpeg" alt="Vitabuddy Hero Image"/>
                <div className="hero-text">
                    <h1>MacroMaxer: Personalized <br/> Nutrition Analysis With <span className="ai">AI</span></h1>
                    <div className="hero-button-container">
                        <button onClick={handleClick} className="hero-button">Try For Free</button>
                    </div>
                </div>
            </div>
            <main>
                <h2 className="main-caption">The nutrition helper designed to empower your journey towards health eating.</h2>
                <h1  ref={featuresRef} className="key-features-title">Key Features</h1>

                <div className="features-container">

                    <div className="each-feature">
                        <div className="feature-img-wrapper">
                            <img className="feature-img-desk" src="/images/progress.png" alt="showcase of vitabuddy custom nutrition goal"></img>
                            <img className="feature-img-mobile" src="/images/mobile.png" alt="showcase of vitabuddy nutriion breakdown"></img>
                        </div>
                        <div className="feature-text">
                            <div className="feature-text-wrapper">
                                <img src="/images/glass.png" alt="magnifying glass"></img>
                                <h4>Detailed Nutrient Breakdown</h4>
                                <p>Gain insights into your daily nutrient intake with comprehensive breakdowns of your meals.</p>
                            </div>
                        </div>
                    </div>

                    <div className="each-feature">
                        <div className="feature-img-wrapper">
                            <img className="feature-img-desk" src="/images/customize-desk.png" alt="showcase of vitabuddy custom nutrition goal"></img>
                            <img className="feature-img-mobile" src="/images/customize-mobile.png" alt="showcase of vitabuddy custom nutrition goal"></img>
                        </div>
                        <div className="feature-text">
                            <div className="feature-text-wrapper">
                                <img src="/images/customize.png" alt="pencil drawing"></img>
                                <h4>Personalized Nutrition Goals</h4>
                                <p>Freely customize your daily nutrition intake targets to meet your personal needs.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* <h4 className="many-benefits">The many benefits of healthy eating for adults According to the US CDC.</h4>
                <ul>
                    <li>Boosts immunity.</li>
                    <li>Strengthens bones.</li>
                    <li>Lowers risk of heart disease, type 2 diabetes, and some cancers.</li>
                    <li>Supports healthy pregnancies and breastfeeding.</li>
                    <li>Helps the digestive system function.</li>
                    <li>Helps achieve and maintain a healthy weight.</li>
                    <li>May help you live longer, Keeps skin, teeth, and eyes healthy.</li>
                    <li>Supports muscles.</li>
                </ul> */}

                <h1 className="transform">Ready to Transform Your Eating Habits?</h1>
                <h2 className="start-journey">Start your journey towards a healthier you.</h2>
                <div className="get-started-container">
                    <button onClick={handleClick} className="hero-button">Get Started</button>
                </div>

            </main>
                
            <Footer />
        </div>
        </>
    );
}
