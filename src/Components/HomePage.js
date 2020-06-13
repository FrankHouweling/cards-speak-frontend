import React from 'react';
import CreateRoomForm from "./CreateRoomForm";

function HomePage(props) {
    return <div>
        <h1>Cards speak</h1>
        <h3 className="text-muted">... for themselves.</h3>

        <CreateRoomForm webSocket={props.webSocket} history={props.history} />
    </div>
}

export default HomePage;