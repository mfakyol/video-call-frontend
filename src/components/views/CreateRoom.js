import React from 'react'
import {v4 as uuid} from 'uuid'

export default function CreateRoom(props) {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }
    return (
        <div>
             <button onClick={create}>Create room</button>
        </div>
    )
}
