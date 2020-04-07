import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './logic.css'
class Logic extends Component {
    render() {
        return (
		<div>
		<h1>Logic Page</h1>
		
		<form>
			<label> Truth Table:</label>
			<textarea class="static" readonly="readonly"> Here is some text</textarea>
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
