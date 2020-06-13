import React from 'react';
import { withRouter } from "react-router-dom";
import {v4 as uuidv4} from "uuid";

class Room extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: null,
            userNameSubmitted: false,
            formError: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
    }

    handleUserNameChange(event) {
        this.setState({
            userName: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let userName = this.state.userName;
        if (userName.length <= 1){
            this.setState({
                formError: "Please enter a username of at least 2 letters, and try again."
            });
            return;
        }
        let request = JSON.stringify({
            'command': 'set_room_username',
            'client_secret': 'abc',
            'slug': this.props.room.slug,
            'user_name': userName
        });
        console.log('Sending: ' + request);
        this.props.webSocket.send(request);
        this.setState({
            userNameSubmitted: true,
        });
    }

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
        let content = <div></div>;
        if (this.state.userNameSubmitted === false){
            content = <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userName">Your name</label>
                        <input type="text" id="userName" className="form-control"
                            value={this.state.userName} onChange={this.handleUserNameChange} />
                    </div>
                    <p>{this.state.formError}</p>
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </form>
            </div>;
        } else if(this.props.room){
            content = <ul>
                 {this.props.room.userNames.values().map((userName) => <li>userName</li>)}
             </ul>;
        }
        return <div>
            <h1>Cards speak</h1>
            <h3 className="text-muted">... for themselves.</h3>
            <hr />
            <h3>{this.props.room ? this.props.room.name : ''}</h3>
            {content}
        </div>
    }
}

export default withRouter(Room);