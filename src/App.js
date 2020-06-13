import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import HomePage from "./Components/HomePage";
import Room from "./Components/Room";


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            ws: null,
            room: {
                name: null
            }
        };
    }

    // single websocket instance for the own application and constantly trying to reconnect.

    componentDidMount() {
        this.connect();
    }

    timeout = 250; // Initial timeout duration as a class variable

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
    connect = () => {
        var ws = new WebSocket("ws://192.168.55.12:3030");
        let that = this; // cache the this
        var connectInterval;

        // websocket onopen event listener
        ws.onopen = () => {
            console.log("connected websocket main component");

            this.setState({ ws: ws });

            that.timeout = 250; // reset timer to 250 on open of websocket connection
            clearTimeout(connectInterval); // clear Interval on on open of websocket connection
        };

        // websocket onclose event listener
        ws.onclose = e => {
            console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    10000 / 1000,
                    (that.timeout + that.timeout) / 1000
                )} second.`,
                e.reason
            );
            this.forceUpdate();

            that.timeout = that.timeout + that.timeout; //increment retry interval
            connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
        };

        // websocket onerror event listener
        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            ws.close();
        };

        ws.onmessage = message => {
            let data = JSON.parse(message.data);
            console.log('Received: ' + message.data);

            if (data.error){
                this.setState({
                    error: data.error
                });
                return;
            }
            if (data.data){
                this.setState({
                    room : data.data
                });
            }
        };
    };

    /**
     * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
     */
    check = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    };

    render() {
        if (this.state.ws === null || this.state.ws.readyState !== WebSocket.OPEN) {
            return <div className="loading">
                <h3>Waiting for connection</h3>
                <p>
                    We are currently waiting for a connection to the service. If this screen stays visible,
                    please check your internet connection.
                </p>
            </div>;
        }
        if (this.state.error) {
            return <div className="container">
                <h3>An error has occurred</h3>
                <p>{this.state.error}</p>
            </div>;
        }
        return (
            <div className="container">
                <div className="App">
                    <Router>
                        <Switch>
                            <Route name="room" path="/:slug" >
                                <Room room={this.state.room} webSocket={this.state.ws} />
                            </Route>
                            <Route path="/" render={({history}) => (
                                <HomePage history={history} webSocket={this.state.ws} />
                            )} />
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
}

export default App;
