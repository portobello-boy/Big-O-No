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

		this.phText = "Here is some text that should be wrapping soon &#10; will that work there as an endline character? I don't know about that either";
		this.booltext = "Example boolean: (a OR b)";
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
			.then(res => {
				this.setState({
					circuit: this.state.circuit,
                	evaluation: res
            	});
		this.text = " ";
		this.truval = " ";
		this.boolexp = " ";
		this.xlength = 0;
		this.between = "----------------------------------------------------------"
	
		let Truthtab = this.state.evaluation[0].table;

		for (let col in Truthtab) {
			this.xlength = Truthtab[col].length;
		
			this.text = this.text + "    |    " + col;
			
			if (!this.state.evaluation[0].vars.includes(col)) {
				this.boolexp += "   " + col;
			}

		}
		for(let i = 0; i < this.xlength; i++){	
			this.truval += "\r\n";
		    	for (let col in Truthtab) {
				let values = Truthtab[col];
				if(JSON.stringify(values[i]) == "true"){
					this.truval = this.truval + "    |    " + 'T';
				}
				else{
					this.truval = this.truval + "    |    " + 'F';	
				}
			}
		
		}
		console.log(this.boolexp);
		this.phText = this.text + "\r\n" + this.between + "\r\n" +  this.truval;
		this.booltext = this.boolexp;
		this.forceUpdate();
	    }));
    }

	render() {
		console.log(this.state.circuit);
		console.log(this.state.evaluation);
		return (
			<div>
				<h1>Logic Page</h1>
				<form>
					<label> Truth Table:</label>
					<textarea class="static" wrap="off" readonly="readonly" cols="15" rows="12" id="table" value={this.phText}>
					</textarea>
				</form>

				<form>
					<label> Bool Expression:
			<textarea class="fixed" wrap="off" readonly="readonly" value={this.booltext}>
						</textarea>
					</label>
				</form>

				<div class="fixed">
					<Link to={'./'}>
						<button1 type="button">Circuit Tester</button1>
					</Link>
				</div>
			</div>


		)
	}
}

export default Logic;
