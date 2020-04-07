import React, { Component } from 'react';

class Logic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            circuit: props.passCircuit,
            evaluation: []
        }
    }

    componentDidMount() {
        const { circuit } = this.props.location.state;
        this.setState({
            circuit: circuit
        }, () => fetch('/circuit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.circuit)
            })
            .then(res => res.json())
            .then(res => this.setState({
                circuit: this.state.circuit,
                evaluation: res
            })));
    }

    render() {
        console.log(this.state.circuit);
        console.log(this.state.evaluation);
        return (
            <h1>Goodbye</h1>
        )
    }
}

export default Logic;