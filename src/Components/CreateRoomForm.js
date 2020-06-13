import React from 'react';
import { v4 as uuidv4 } from 'uuid';

class CreateRoomForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            loading: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {
        this.setState({
            name: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            loading: true
        });

        let slug = uuidv4();
        let request = JSON.stringify({
            'command': 'create_room',
            'client_secret': 'abc',
            'slug': slug,
            'name': this.state.name
        });
        console.log('Sending: ' + request);
        this.props.webSocket.send(request);

        this.props.history.push('/' + slug);
    }


    render() {
        if (this.state.loading === true){
            return <div className="loading">
                <p>A new table is being set up...</p>
            </div>
        }
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Deal a new table</h3>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" value={this.state.name} onChange={this.handleNameChange} />
                </div>

                <button>
                    Create!
                </button>
            </form>
        );
    }
}

export default CreateRoomForm;