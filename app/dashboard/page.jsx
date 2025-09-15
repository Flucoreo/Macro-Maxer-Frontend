"use client";

import "./page.css"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation';

// import Meal from "../components/meal"
import Nav from "../components/nav"
import Staged from "../components/staged_meal"
import { NutrientAccordion } from "../components/accordion"
import { GeneralNutrientAccordion } from "../components/accordion"
import { getUserInfo, refreshToken, getUserPreferences, startNutrientsJob, checkNutrientsJob } from "../auth"
import maping from "../vitamin_maps"


export default function Page(){

    const router = useRouter();
    const jobIdRef = useRef(null);
    const [fetchingNutritionData, setFetchingNutritionData] = useState(false)
    const [nutritionForm, setNutritionForm] = useState(''); 
    const [meal, setMeal] = useState([]);
    const [userData, setUserData] = useState({
        username: "",
        useremail: "",
        credits: ""
    })
    const [nutrientData, setNutrientData] = useState(
        {
            "general": {
                "Calories": {target: 0, amount: 0},
                "Protein": {target: 0, amount: 0}
            }, 

            "vitamins": {
                "Vitamin A": {target: 0,   amount: 0},   
                "Vitamin B1 (Thiamine)": {target: 0, amount: 0},
                "Vitamin B2 (Riboflavin)": {target: 0, amount: 0},
                "Vitamin B3 (Niacin)": {target: 0, amount: 0},
                "Vitamin B5 (Pantothenic acid)": {target: 0, amount: 0},
                "Vitamin B6 (Pyridoxine)": {target: 0, amount: 0},
                "Vitamin B9 (Folate)": {target: 0, amount: 0},
                "Vitamin B12 (Cobalamin)": {target: 0, amount: 0},
                "Vitamin C": {target: 0, amount: 0},
                "Vitamin D": {target: 0, amount: 0},
                "Vitamin E": {target: 0, amount: 0},
                "Vitamin K": {target: 0, amount: 0}
            },

            "minerals": {
                "Sodium": {target: 0, amount: 0},
                "Calcium": {target: 0, amount: 0},
                "Copper": {target: 0, amount: 0},
                "Iodine": {target: 0, amount: 0},
                "Iron": {target: 0, amount: 0},
                "Magnesium": {target: 0, amount: 0},
                "Phosphorus": {target: 0, amount: 0},
                "Potassium": {target: 0, amount: 0},
                "Selenium": {target: 0, amount: 0},
                "Zinc": {target: 0, amount: 0},
                "Manganese": {target: 0, amount: 0}
            },

            "carbs": {
                "Fiber": {target: 0, amount: 0},
                "Starch": {target: 0, amount: 0},
                "Added Sugars": {target: 0, amount: 0},
                "Net Carbs": {target: 0, amount: 0}
            },

            "fats": {
                "Omega 3": {target: 0, amount: 0},
                "Omega 6": {target: 0, amount: 0},
                "Monounsaturated Fat": {target: 0, amount: 0},
                "Saturated Fat": {target: 0, amount: 0},
                "Trans Fat": {target: 0, amount: 0},
                "Cholesterol": {target: 0, amount: 0}
            }
        }
    );


    // user auth
    useEffect(() => {
        // prevent state updates after unmount
        let isMounted = true;

        const fetchUser = async () => {
            try {
                const userInfo = await getUserInfo();
                const user_preferences = await getUserPreferences();
                if (!isMounted) return;
                setUserData({username: userInfo.data.username, useremail: userInfo.data.useremail, credits: userInfo.data.credits});
                updateNutritionTarget(user_preferences.data)
            } catch (err) {
                // if user is not logged in, try to refresh the tokens
                try {
                    await refreshToken();
                    const userInfo = await getUserInfo();
                    const user_preferences = await getUserPreferences();
                    if (!isMounted) return;
                    setUserData({username: userInfo.data.username, useremail: userInfo.data.useremail});
                    updateNutritionTarget(user_preferences.data)
                } catch (err) {
                    // router.push("/login");
                }
            }
        }
        fetchUser();

        return () => {
            // cleanup when component unmounts
            isMounted = false;
        };
    }, [router]);


    // handle form inputs
    const handleChange = (e) => {
        setNutritionForm(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(e);

        if (nutritionForm == ""){
            alert("Please enter a food item before submitting.");
            return;
        }
        setNutritionForm('');
        
        // schedule the job and get it's id
        try {
            const res = await startNutrientsJob(nutritionForm)
            jobIdRef.current =  res.data.job_id;
            setUserData((prev) => ({...prev, credits: res.data.credits}))
            setFetchingNutritionData(true)
        } catch (err) {
            if (err.status == 403){
                alert("No more remaining AI credits, will reset tomorow.")
                setFetchingNutritionData(false)
                return
            }

            if (err.status == 503){
                alert("Failed to get nutrient data.")
                setFetchingNutritionData(false)
                return
            }

            try {
                await refreshToken();
                const res = await startNutrientsJob(nutritionForm)
                jobIdRef.current =  res.data.job_id;
                setUserData((prev) => ({...prev, credits: res.data.credits}))
            } catch (err){
                if (err.status == 401){
                    router.push("/login");
                } else {
                    setFetchingNutritionData(false)
                    alert("Failed to get nutrient data.")
                    return
                }   
            }
        }

        // monitor the job and get the nutrition data once completed
        const interval = setInterval(async () => {

            try {
                const res = await checkNutrientsJob(jobIdRef.current);
                if (res.data.status === "finished") {
                    clearInterval(interval);
                    if (res.data.result.hasOwnProperty("error")){
                        clearInterval(interval);
                        setFetchingNutritionData(false)
                        alert("Do not input non food items.")
                        return
                    }
                    addEachFoodItem(res.data.result.items)
                    setFetchingNutritionData(false)
                } else if (res.data.status == "failed" || res.data.status == "unknown") {
                    clearInterval(interval);
                    setFetchingNutritionData(false)
                    alert("Failed to get nutrient data")
                    return
                }
            } catch (err){
                try {
                    await refreshToken();
                    const res = await checkNutrientsJob(jobIdRef.current)
                    if (res.data.status === "finished") {
                        clearInterval(interval);
                        if (res.data.result.hasOwnProperty("error")){
                            clearInterval(interval);
                            setFetchingNutritionData(false)
                            alert("Do not input non food items.")
                            return
                        }
                        addEachFoodItem(res.data.result.items)
                        setFetchingNutritionData(false)
                    } else if (res.data.status == "failed" || res.data.status == "unknown" || res.data.status.startsWith("job_not_found")) {
                        clearInterval(interval);
                        setFetchingNutritionData(false)
                        alert("Failed to get nutrient data.")
                        return
                    }
                } catch (err){
                    if (err.status == 401){
                        router.push("/login");
                    } else {
                        clearInterval(interval);
                        setFetchingNutritionData(false)
                        alert("Failed to get nutrient data.")
                        return
                    }   
                }
            }
            
        }, 3000);
    };


    // updating the nutrition state and the meal state based on the ingredients the user submited
    const addEachFoodItem = (foodItemsList) => {
        let foodSet = ""

        for (let i in foodItemsList){
            updateNutrition(foodItemsList[i])
            foodSet += `${foodItemsList[i].name} ${foodItemsList[i].serving_size}, `
        }

        setMeal(prev => ([...prev, foodSet]));
    }

    
    // updating the nutrition state ammount based on data returned from backend
    const updateNutrition = (newData) => {
        setNutrientData(prevData => {
            const updatedData = { ...prevData };

            const fatMap = maping.fat_map
            const vitaminMap = maping.vitamin_map
            const mineralMap = maping.mineral_map 
            const carbMap = maping.carb_map

            updatedData.general['Calories'].amount = Number((updatedData.general['Calories'].amount + newData.general.calories).toFixed(1));
            updatedData.general['Protein'].amount = Number((updatedData.general['Protein'].amount + newData.general.protein / 1000).toFixed(1));

            Object.keys(vitaminMap).forEach(key => {
                updatedData.vitamins[vitaminMap[key]].amount = Number(
                    (updatedData.vitamins[vitaminMap[key]].amount + (newData.vitamins[key] || 0)).toFixed(3)
                );
            });

            Object.keys(mineralMap).forEach(key => {
                updatedData.minerals[mineralMap[key]].amount = Number(
                    (updatedData.minerals[mineralMap[key]].amount + (newData.minerals[key] || 0)).toFixed(3)
                );
            });

            Object.keys(carbMap).forEach(key => {
                updatedData.carbs[carbMap[key]].amount = Number(
                    (updatedData.carbs[carbMap[key]].amount + (newData.carbs[key]/1000 || 0)).toFixed(1)
                );
            });

            Object.keys(fatMap).forEach(key => {
                if (key.endsWith("fat")){
                    updatedData.fats[fatMap[key]].amount = Number(
                        (updatedData.fats[fatMap[key]].amount + (newData.fats[key]/1000 || 0)).toFixed(2)
                    );
                } else {
                    updatedData.fats[fatMap[key]].amount = Number(
                        (updatedData.fats[fatMap[key]].amount + (newData.fats[key] || 0)).toFixed(2)
                    );
                }
            });

            return updatedData;
        });
    };


    // updating the nutrition state target based on data from backend + user in database
    const updateNutritionTarget = (newData) => {
        setNutrientData(prevData => {
            const updatedData = { ...prevData };

            updatedData.general['Calories'].target = newData.general.Calories
            updatedData.general['Protein'].target = newData.general.Protein

            for (let vitamin in prevData.vitamins){ updatedData.vitamins[vitamin].target = newData.vitamins[vitamin] }
            for (let mineral in prevData.minerals){ updatedData.minerals[mineral].target = newData.minerals[mineral] }
            for (let carb in prevData.carbs){ updatedData.carbs[carb].target = newData.carbs[carb] }
            for (let fat in prevData.fats){ updatedData.fats[fat].target = newData.fats[fat] }

            return updatedData;
        });
    };


    // useEffect(() => {
    //     console.log(meal)
    // }, [meal]);

    return (
        <>
            <p className={fetchingNutritionData ? "save-confirmation-show" : "save-confirmation"}>Loading Nutrition Breakdown...</p>
            <Nav beginning_letter={userData.username[0]} user_credits={userData.credits}/>
            <main className="dashboard-container">
                <div className="dashboard-main-content">
                
                    <div className="header">
                        <h1 className="dashboard-title">{userData.username != "" ? `${userData.username}'s `: ""} Meals</h1>
                        <div className="staged-meals-container">
                            <Staged ingredients={meal}/>
                        </div>
                        <h2 className="dashboard-sub-title">Nutrient Breakdown</h2>    
                    </div>

                    <GeneralNutrientAccordion data={nutrientData.general} title={"General"} />
                    <NutrientAccordion data={nutrientData.vitamins} title={"Vitamins"} />
                    <NutrientAccordion data={nutrientData.minerals} title={"Minerals"} />
                    <NutrientAccordion data={nutrientData.carbs} title={"Carbs"} />
                    <NutrientAccordion data={nutrientData.fats} title={"Fats and Cholesterol"} />
                </div>

                <div className="dashboard-side-bar">
                    <form className="text-input-form" onSubmit={handleSubmit}>
                        <textarea
                            id="meal"
                            type="text"
                            className="text-input"
                            value={nutritionForm}
                            onChange={handleChange}
                            placeholder={`Enter food items or recipe. \n\nBe specific, e.g. instead of "1 serving pasta", type "1/2 cup marinara sauce, 1 cup whole grain spagetti noodles"`}
                        />
                        {userData.username != "" 
                        ?
                        <div className="submit-button-container">
                            <button type="submit" className="submit-button">View Nutrient Breakdown</button>
                        </div>
                        : <p></p>}
                    </form>
                    {userData.username == "" && <div className="submit-button-container">
                        <button onClick={() => {router.push("/login")}}className="submit-button">Sign In to Get Nutrition Breakdowns</button>
                    </div>}
                        

                    {/* <h2 className="meals-title">Meals</h2>
                    <div className="user-meals">
                        <p className="user-meals-placeholder">Your current meals appear here</p>
                        <Meal />
                        <Meal />
                    </div> */}
                </div>
            </main>
        </>
    );
}
