import React from 'react';
import { Container, DropdownDivider } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';



// get this from spotifyAPI docs...scope refers to what we want access to
const AUTH_URL = 'https://accounts.spotify.com/authorize?client_id=008729f8fd944c159636febb87f45b2c&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state'

// after logging in to spotify and selecting agree, use the url code in address bar to select the access token
// for user to authenticate them for requests.
// to do that, we need to create a server 


// create a functional React component for the login page

export default function Login() {
    return (
        <div className= "bg-dark">
            {/* DISPLAY APP TITLE */}

            <h1 className="display-4 text-center text-white border border-2 bg-success">Trevor's Music App</h1>
            {/* Loading Spinner for some visual effect */}

            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <i className="bi bi-disc align-center" style={{fontSize: '3em', color: 'white',
        animation: 'spin 2s linear infinite'}}></i>
            </div>
            
            {/* Create container for the login button */}

            <Container className="d-flex justify-content-center align-items-center bg-dark" style={{ minHeight: "75vh" }}>
                <a className="btn btn-success btn-lg" href={AUTH_URL}>Login With Spotify</a>
            </Container>

            {/* Use CSS animation to make the icon spin  */}
            <style>
                {`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }`}
            </style>
        </div>
    );
}
