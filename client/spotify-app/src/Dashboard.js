import {useState, useEffect} from 'react';
import useAuth from "./useAuth";
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from './TrackSearchResults';
import Player from './Player';
import axios from 'axios';

// To use spotify api, you need an account. from there you get clientId and access token

const spotifyApi = new SpotifyWebApi({
    clientId: "008729f8fd944c159636febb87f45b2c"
})

// main function that renders the dashboard
export default function Dashboard({code}) {

    // use the useAuth custom hook to get the access token
    const accessToken = useAuth(code)

    // Define state variables
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setplayingTrack] = useState()
    const [lyrics, setLyrics] = useState('')

    // function to choose a track to play

    function chooseTrack(track) {
        // if track is playing display track, and set the lyrics and searchbar to be empty
        setplayingTrack(track)
        setSearch('')
        setLyrics('')
    }

    // Effect to fetch lyrics when a track is playing ... NOTE the API used is not the greatest
    useEffect(() => {
        // if no track is playing, return nothing
        if (!playingTrack) return;
        // api call to get the track's lyrics
        axios
        .get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist,
            },
            //if successful, lyrics will be shown
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])

    // Effect to set the access token for the spotify api

    useEffect(() => {
        // if no access token is provided, return nothing
        if(!accessToken) return;
        // set the access token for spotify api
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    // Effect to search for tracks when teh search term changes
    useEffect(() => {
        // if no search term is provided, return nothing
        if(!search) return setSearchResults([]);
        if (!accessToken) return;

        // track if component unmounts before the api call completes
        let cancel = false;

        // make an api call to spotify to search for tracks
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return;
            
            //update search results with track data
            setSearchResults(res.body.tracks.items.map(track => {
                
                // find smallest album image
                const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                if (image.height < smallest.height) return image
                return smallest;
            }, track.album.images[0])
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }))
        })

        return () => cancel = true;
    }, [search, accessToken])


    // return the jsx for the dashboard
    
    return (
    <div className="text-center bg-dark">
    <Container className="d-flex flex-column py-1 bg-light" style={{height: "100vh"}}>
      <Form.Control type="search" placeholder="Search Songs/Artists" 
      value={search} onChange={e => setSearch(e.target.value)} />

      <div className="flex-grow-1 my-2 bg-light" style={{ overflowY: "auto"}}>
        {searchResults.map(track => (
            <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
        ))}

        {searchResults.length === 0 && (
            <div className="text-center bg-dark text-white" style={{ whiteSpace: "pre"}}>
               {lyrics}
                </div>

        )}

        </div>
      <div className="py-2"><Player accessToken={accessToken} trackUri={playingTrack?.uri}/>
      </div>
    </Container>
    </div>
    )
}
