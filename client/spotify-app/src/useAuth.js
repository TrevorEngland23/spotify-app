import { useEffect, useState } from 'react';
import axios from 'axios';

// Handle spotify authentication

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState(); // allows us to interact with the api to get all the data we want
    const [refreshToken, setRefreshToken] = useState(); // refreshes token after 3600s so user can stay logged in
    const [expiresIn, setExpiresIn] = useState();

    // Exchange authorization code for tokens

    useEffect(() => {
        axios.post('http://localhost:3001/login', {
            code,
        }).then(res => {
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);
            // Update browsers state to remove the code from the URL
            window.history.pushState({}, null, '/')
        }).catch(() => {
            // Redirect the user to the homepage in the event of an error 
            window.location = '/';
        })
    }, [code])

    // Auto-refresh tokens to prevent them from expiring (default 1 hour)
    
    useEffect(() => { 
        // If there is no token or expiring time, then we are done with this part
        if (!refreshToken || !expiresIn) return

        // Establish an interval to periodcally refresh the access token
        const interval = setInterval(() => {

        axios.post('http://localhost:3001/refresh', {

            refreshToken,
        }).then(res => {
            // Update the acces token and expiration time with the refreshed tokens and time
            setAccessToken(res.data.accessToken);
            setExpiresIn(res.data.expiresIn);
    
        }).catch(() => {
            // Redirect the user back to homepage if an error occurs
            window.location = '/';
        })
        // refresh the token 60 seconds before it exires. default is 1 hour, or 1000 seconds
    }, (expiresIn - 60) * 1000);

    // Clear the interval once the component unmounts

    return () => clearInterval(interval);
    
    }, [refreshToken, expiresIn])

    return accessToken
}
