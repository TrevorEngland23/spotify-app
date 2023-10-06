import {useState, useEffect} from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

// Create React component for the music player

export default function Player({accessToken, trackUri}) {

  // Define state variable to manage playback
    const[play, setPlay] = useState(false)

    // Use an effect to start playback when the trackURI changes

    useEffect(() => setPlay(true), [trackUri])

  // If there is no access token, don't render anything since that person did not authenticate.
    if (!accessToken) return null

    // Return the spotify player component with all controls
  return (
  <SpotifyPlayer
   token = {accessToken}
   showSaveIcon
   callback={state => {

    // Update the play state based on playback state
    if (!state.isPlaying) setPlay(false)
   }}
   play={play}
   uris={trackUri ? [trackUri] : []}
   />
  )
}
