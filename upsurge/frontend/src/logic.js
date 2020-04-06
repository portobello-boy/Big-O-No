import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './logic.css'
class Logic extends Component {
    render() {
        return (
		<div>
		<h1>Goodbye</h1>
		
		<Link to ={'./'}>
			<button type="button">Testing</button>
		</Link>
		<form>
			<label> Truth Table: 
				<input type ='text' name="name" />
			</label>
			<input type="submit" value="Submit" />
		</form>
		</div>


	)
    }
}

export default Logic;
