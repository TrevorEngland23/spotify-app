const express = require('express');
const SpotifyApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder');

// Create an Express app

const app = express();

// Use CORS middleware to enable cross-origin requests
app.use(cors());

// Use a body parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for refreshing the access token
app.post('/refresh', (req, res) => {

    // Get the refresh token from the request body
    const refreshToken = req.body.refreshToken;

    // Create a SpotifyApi instance with client credentials and refresh token
    const spotifyApi = new SpotifyApi({
        redirectUri: "http://localhost:3000",
        clientId: "008729f8fd944c159636febb87f45b2c",
        clientSecret: "402a7a04b3484bb7bee34a964a3e9171",
        refreshToken
        })

        // Use spotifyapi to refresh the access token

    spotifyApi.refreshAccessToken().then(
        function (data) {

            // Send a JSON response with new access token, refresh token, and expriation time
            res.json({
                accessToken: data.body.accessToken,
                refreshToken: data.body.refreshToken,
                expiresIn: data.body.expiresIn
            })

            // Set the new access token for the spotifyapi instance
            spotifyApi.setAccessToken(data.body['access_token']);
        }).catch(() => {
            // Handle errors by sending a 400 status code (Bad Request)
            res.sendStatus(400);
        })
});

// Define a route for the initial login process

app.post('/login', (req, res) => {

    // Get authorization code from request body
    const code = req.body.code;

    // Create a SpotifyApi instance with client credentials
    const spotifyApi = new SpotifyApi({
        redirectUri: "http://localhost:3000",
        clientId: "008729f8fd944c159636febb87f45b2c",
        clientSecret: "402a7a04b3484bb7bee34a964a3e9171",
        })

        // Use spotifyapi to exchange the code for access and refresh tokens

    spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {

        // Send a JSON response with the access tokens, refresh tokens, and expiration time
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    })
    .catch((err) => {
        // Log the errors and send a status code of 400 (Bad Request)
        console.log(err)
        res.sendStatus(400)
    })
});

// Define a route for retrieving lyrics

app.get("/lyrics", async (req, res) => {
    // Use lyricsFinder library to fetch lyrics based on the artist and track name
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "Lyrics Currently Not Available";
    
    // Send a JSON response with the fetched lyrics
    res.json({lyrics})
});

// Start the Express server on port 3001
app.listen(3001)

