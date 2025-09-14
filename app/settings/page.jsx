"use client";

import "./page.css"
import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';

import Nav from "../components/nav"
import data from "../default_nutrients"
import { calculateMaintenanceCalories } from "../utils"
import { refreshToken, getUserPreferences, updateUserPreferences, getUserInfo } from "../auth"


export default function Page(){

    const router = useRouter();
    const [defaultData, setDefaultData] = useState(data);
    const [originalDefaultData, setOriginalDefaultData] = useState(data);
    const [saveConfirmation, setSaveConfirmation] = useState('noShow')
    const [userPreferences, setUserPreferences] = useState({
        age: "",
        weightLbs: "",
        heightFt: "",
        heightIn: "",
        gender: "",
        activityLevel: "sedentary",
    });
    const [userData, setUserData] = useState({
        username: "",
        useremail: "",
        credits: ""
    })

    // check if a user is already logged in when they visit the settings page, also get user nutrition preferences
    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            try {
                const userInfo = await getUserInfo();
                const preferences = await getUserPreferences();
                if (!isMounted) return;
                setDefaultData(preferences.data)
                setOriginalDefaultData(preferences.data)
                setUserData({username: userInfo.data.username, useremail: userInfo.data.useremail, credits: userInfo.data.credits});
            } catch (err) {
                // if user is not logged in, first try to get new access token with refresh token
                try {
                    await refreshToken();
                    const userInfo = await getUserInfo();
                    const preferences = await getUserPreferences();
                    if (!isMounted) return;
                    setDefaultData(preferences.data)
                    setOriginalDefaultData(preferences.data)
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

    // handle the TDEE form
    function handleChange(e) {
        const { name, value } = e.target;
        let newValue = value;

        if (["age", "heightFt", "heightIn", "weightLbs"].includes(name)) {
            if (value === "") {
                newValue = "";
            } else {
                newValue = Number(value);

                // clamp values based on field
                if (name === "age") newValue = Math.min(Math.max(newValue, 0), 120);
                if (name === "heightFt") newValue = Math.min(Math.max(newValue, 0), 10);
                if (name === "heightIn") newValue = Math.min(Math.max(newValue, 0), 12);
                if (name === "weightLbs") newValue = Math.min(Math.max(newValue, 0), 1000);
            }
        }

        setUserPreferences(prev => ({
            ...prev,
            [name]: newValue
        }));
    }

    // handle saving TDEE preferences
    function handleSavePreferences(e){
        e.preventDefault()
        for (let key in userPreferences){
            if (userPreferences[key] === ""){
                alert("Please fill in all user preferences before submitting.")
                return;
            }
        }

        const maintencanceCalories = calculateMaintenanceCalories({
            age: userPreferences.age,
            weightLbs: userPreferences.weightLbs,
            heightFt: userPreferences.heightFt,
            heightIn: userPreferences.heightIn,
            gender: userPreferences.gender,
            activityLevel: userPreferences.activityLevel
        })

        handleNutrientDataChange("general", "Calories", maintencanceCalories);
    }

    // handle changing nutrient data
    function handleNutrientDataChange(category, name, value) {    
        setDefaultData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [name]: value
            }
        }));
    }

    async function handleSaveNutrientPreferences(e, preferences) {
        e.preventDefault()
        setSaveConfirmation('saving')
        await new Promise(resolve => setTimeout(resolve, 1000))

        try {
            const res = await updateUserPreferences(preferences)
            setSaveConfirmation('saved')
            setTimeout(() => setSaveConfirmation(0), 1500)
        } catch (err) {
            try {
                await refreshToken();
                const res = await updateUserPreferences(preferences)
                setSaveConfirmation('saved')
                setTimeout(() => setSaveConfirmation(0), 1500)
            } catch (err){
                if (err.status == 401){
                    router.push("/login");
                } else {
                    setTimeout(() => setSaveConfirmation(0), 1)
                    alert("Unable to Update Nutrition Preferences")
                    return
                }   
            }
        }
    }

    function resetToDefaultNutrition(category){
        setDefaultData(prev => ({
            ...prev,
            [category]: originalDefaultData[category]
        }));
    }

    const defaultCarbs = Object.entries(defaultData.carbs).map(([key, value]) => (
        <div key={key}>
            <label className="profile-input" htmlFor={key}>{key} (g)</label> <br/>
            <input className="profile-input-text-2" type="number" name={key} value={value} onChange={(e) => handleNutrientDataChange("carbs", key, e.target.value)}/> 
        </div>
    ));

    const defaultMinearls = Object.entries(defaultData.minerals).map(([key, value]) => (
        <div key={key}>
            <label className="profile-input" htmlFor={key}>{key} (mg)</label> <br/>
            <input className="profile-input-text-2" type="number" name={key} value={value} onChange={(e) => handleNutrientDataChange("minerals", key, e.target.value)}/> 
        </div>
    ));

    const defaultFats = Object.entries(defaultData.fats).map(([key, value]) => (
        <div key={key}>
            <label className="profile-input" htmlFor={key}>{key.slice(-3) == "Fat" ? key + " (g)" : key + " (mg)"}</label> <br/>
            <input className="profile-input-text-2" type="number" name={key} value={value} onChange={(e) => handleNutrientDataChange("fats", key, e.target.value)}/> 
        </div>
    ));

    const defaultVitamins = Object.entries(defaultData.vitamins).map(([key, value]) => (
        <div key={key}>
            <label className="profile-input" htmlFor={key}>
                {key.length < 11
                    ? <>{" "}<br/>{`${key}`}</>
                    :<>{key.slice(0,11)}<br/>{key.slice(11)}</>
                } (mg)
            </label> <br/>
            <input className="profile-input-text-2" type="number" name={key} value={value} onChange={(e) => handleNutrientDataChange("vitamins", key, e.target.value)}/> 
        </div>
    ));

    // useEffect(() => {
    //     console.log("defaultData changed:", defaultData);
    // }, [defaultData]);

    
    return (
        <>
            <p className={saveConfirmation == 'saved' ? "save-confirmation-show" : "save-confirmation"}>Saved Your Preferences!</p>
            <p className={saveConfirmation == 'saving' ? "save-confirmation-show" : "save-confirmation"}>Saving...</p>
            <Nav beginning_letter={userData.username == "" ? ".." : userData.username[0]} user_credits={userData.credits}/>
            <main className="container">
                <div className="form-container">
                    <div>
                        <h1 className="settings-title">Settings</h1>
                        <p className="settings-caption">Customize your experience to fit your dietary needs and preferences.</p>
                    </div>

                    <form className="profile-form" onSubmit={handleSavePreferences}>
                        <h2 className="settings-sub-title">User Preferences</h2>

                        <div>
                            <label className="profile-input" htmlFor="age">Age: </label> <br/>
                            <input className="profile-input-text" type="number" name="age" value={userPreferences.age} onChange={handleChange} placeholder="20"/> 
                        </div>
                        
                        <div className="profile-radios">
                            <span className="profile-radios-title" >Gender:</span>

                            <input type="radio" id="male" value="male" name="gender"  checked={userPreferences.gender === "male"} onChange={handleChange}></input>
                            <label htmlFor="gender" className="profile-radio-button" >Male</label>

                            <input type="radio" id="female" value="female" name="gender"  checked={userPreferences.gender === "female"} onChange={handleChange} ></input>
                            <label htmlFor="female" className="profile-radio-button" checked={userPreferences.gender === "female"}>Female</label>

                            <input type="radio" id="non-binary" value="non-binary" name="gender"  checked={userPreferences.gender === "non-binary"} onChange={handleChange} ></input>
                            <label htmlFor="non-binary" className="profile-radio-button">Non Binary</label>
                        </div>

                        <div>
                            <label className="profile-input" htmlFor="heightFt">Height: </label> <br/>
                            <input className="profile-input-text" type="number"  name="heightFt" placeholder="ft" value={userPreferences.heightFt} onChange={handleChange}/> 
                            <input className="profile-input-text" type="number"  name="heightIn" placeholder="in" value={userPreferences.heightIn} onChange={handleChange}/> 
                        </div>

                        <div>
                            <label className="profile-input" htmlFor="weightLbs">Weight: </label> <br/>
                            <input className="profile-input-text" type="tnumberext"  name="weightLbs" placeholder="120 lbs" value={userPreferences.weightLbs} onChange={handleChange}/> 
                        </div>

                        <div>   
                            <label className="profile-input" htmlFor="activityLevel">Activity Level:</label> <br/>
                            <select className="profile-dropdown" name="activityLevel" value={userPreferences.activityLevel} onChange={handleChange}>
                                <option value="sedentary">Sedentary: little or no exercise</option>
                                <option value="light_exercise">Light: exercise 1 - 3 times a week</option>
                                <option value="moderate_exercise">Moderate: axercise 4 - 5 times a week</option>
                                <option value="active">Active: daily exercise or intense exercise 3 - 4 times a week</option>
                                <option value="very_active">Very Active: intense exercise 6 - 7 times a week</option>
                                <option value="extra_active">Extra Active: intense daily exercise or physical job</option>
                                <option value="bmr">Basal Metabolic Rate (BMR)</option>
                            </select>
                        </div>

                        <div className="submit-button-container">
                            <button type="submit" className="submit-button">Calculate Total Daily Energy Expenditure</button>
                        </div>
                    </form>

                    <form className="profile-form" onSubmit={(e) => handleSaveNutrientPreferences(e, defaultData)}>
                        <h2 className="settings-sub-title">Daily Values for Nutrients</h2>
                        <p>Zero value indicates no recommended target daily value</p>

                        <div className="recommended-nutrients-containter">
                            <div>
                                <label className="profile-input" htmlFor="Calories">Maintinance Calories</label> <br/>
                                <input className="profile-input-text-2" type="number" name="Calories" value={defaultData.general.Calories} onChange={(e) => handleNutrientDataChange("general", "Calories", e.target.value)}/> 
                            </div>

                            <div>
                                <label className="profile-input" htmlFor="Protein">Daily Value Protein (g)</label> <br/>
                                <input className="profile-input-text-2" type="number" name="Protein" value={defaultData.general.Protein} onChange={(e) => handleNutrientDataChange("general", "Protein", e.target.value)}/> 
                            </div>
                        </div>

                        <div className="recommended-and-reset-container">
                            <h3 className="recommended-nutrients-title">Carbs</h3>
                            <button className="reset-button" onClick={(e) => resetToDefaultNutrition("carbs")}>Reset to Default</button>
                        </div>
                        <div className="recommended-nutrients-containter">    
                            {defaultCarbs}
                        </div>

                        <div className="recommended-and-reset-container">
                            <h3 className="recommended-nutrients-title">Minerals</h3>
                            <button className="reset-button" onClick={(e) => resetToDefaultNutrition("minearals")}>Reset to Default</button>
                        </div>
                        <div className="recommended-nutrients-containter">    
                            {defaultMinearls}
                        </div>

                        <div className="recommended-and-reset-container">
                            <h3 className="recommended-nutrients-title">Fats and Cholesterol</h3>
                            <button className="reset-button" onClick={(e) => resetToDefaultNutrition("fats")}>Reset to Default</button>
                        </div>
                        <div className="recommended-nutrients-containter">    
                            {defaultFats}
                        </div>

                        <div className="recommended-and-reset-container">
                            <h3 className="recommended-nutrients-title">Vitamins</h3>
                            <button className="reset-button" onClick={(e) => resetToDefaultNutrition("vitamins")}>Reset to Default</button>
                        </div>
                        <div className="recommended-nutrients-containter">    
                            {defaultVitamins}
                        </div>

                        <div className="submit-button-container">
                            <button type="submit" className="submit-button">Save Nutrient Preferences</button>
                        </div>
                    </form>

                </div>
            </main>
        </>
    );
}