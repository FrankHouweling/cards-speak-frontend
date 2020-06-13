import React from 'react';
import { withRouter } from "react-router-dom";

class Room extends React.Component {
    componentDidMount() {
        let request = JSON.stringify({
            'command': 'enter_room',
            'client_secret': 'abc',
            'slug': this.props.match.params.slug
        });
        console.log('Sending: ' + request);
        this.props.webSocket.send(request)
    }

    render() {
        return <p>
            This is a room with the name {this.props.room ? this.props.room.name : ''}.
        </p>;
    }
}

export default withRouter(Room);