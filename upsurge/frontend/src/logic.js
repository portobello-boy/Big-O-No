import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './logic.css'
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
		<div>
		<h1>Logic Page</h1>
		
		<form>
			<label> Truth Table:</label>
			<textarea class="static" wrap="off" readonly="readonly" cols="15" rows="12" > Here is some text that should be wrapping soon &#10; will that work there as an endline character? I don't know about that either </textarea>
		</form>

		<form>
			<label> Bool Expression:
			<textarea class="fixed" wrap="off" readonly="readonly"> example exp: (a & b) </textarea>
			</label>
		</form>

		<div class ="fixed">
		<Link to ={'./'}>
			<button1 type="button">Circuit Tester</button1>
		</Link>
		</div>
		</div>


	)
    }
}

export default Logic;
