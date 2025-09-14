// "use client";

import axios from 'axios'

export const register = async (username, email, password) => {
    try {
        const data = {
            "username": username,
            "useremail": email,
            "userpassword": password
        }

        const response = await axios.post(`api/auth/signup/`,
            data,
            {withCredentials: true}
        )
        
        return response
    } catch (err) {
        throw err
    }
}

export const login = async (email, password) => {
    const data = new URLSearchParams();
    data.append("username", email);
    data.append("password", password);

    try {

        const response = await axios.post(`api/auth/login/`,
            data, 
            {headers: {
                headers: {"Content-Type": "application/x-www-form-urlencoded"}
            }},
            {withCredentials: true}
        )

        return response
    } catch (e) {
        throw new Error(`Registration faild! ${e}`)
    }
}

export const logout = async () => {
    try {
        const response = await axios.post(`api/auth/logout/`,
            {withCredentials: true}
        )

        return response
    } catch (e) {
        throw new Error(`Logout faild! ${e}`)
    }
}

export const refreshToken = async () => {
    try {
        const response = await axios.post(`api/auth/refresh/`,
            {withCredentials: true}
        )

        return response
    } catch (e) {
        throw new Error(`request faild! ${e}`)
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axios.get(`api/whoami/`,
            {withCredentials: true}
        )

        return response
    } catch (e) {
        throw new Error(`request faild! ${e}`)
    }
}

export const getUserPreferences = async () => {
    try {
        const response = await axios.get(`api/preferences/`,
            {withCredentials: true}
        )

        return response
    } catch (e) {
        throw new Error(`request faild! ${e}`)
    }
}

export const updateUserPreferences = async (preferences) => {
    try {
        const response = await axios.post(`api/preferences/`,
            preferences,
            {withCredentials: true}
        )

        return response
    } catch (e) {
        throw e
    }
}

export const startNutrientsJob = async (user_input) =>{
    try {
        const response = await axios.post(`/api/nutrition?user_recipe=${user_input}`,
            {withCredentials: true}
        );

        return response
    } catch (e){
        throw e
    }
}

export const checkNutrientsJob = async (user_input) =>{
    try {
        const response = await axios.get(`/api/nutrition?job_id=${user_input}`,
            {withCredentials: true}
        );

        return response
    } catch (e){
        throw e
    }
}

export const changePassword = async (oldpassword, password) => {
    try {
        const data = {
            "oldpassword": oldpassword,
            "password": password,
        }

        const response = await axios.post(`api/update_password/`,
            data,
            {withCredentials: true}
        )
        
        return response
    } catch (err) {
        throw err
    }
}

export const deleteAccount = async (password) => {
    try {
        const data = {
            "password": password,
        }

        const response = await axios.post(`api/delete_user/`,
            data,
            {withCredentials: true}
        )
        
        return response
    } catch (err) {
        throw err
    }
}