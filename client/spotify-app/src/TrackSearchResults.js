import React from 'react';

export default function TrackSearchResult({track, chooseTrack}) {
    function handlePlay() {
        chooseTrack(track)
    }
    return (
        <div className="d-flex m-2 align-items-center" style={{cursor: "pointer", "cursor:hover": "background-color: lightgray"}}
        onClick={handlePlay}>
            <img src={track.albumUrl} style={{height: '64px', width: '64px'}} />
            <div className="mx-3">
                <div className="lead">{track.title}</div>
                <div className="text-muted small ">{track.artist}</div>
            </div>

        </div>
    )
}