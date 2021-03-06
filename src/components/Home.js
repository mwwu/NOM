import React, { Component } from 'react';
// eslint-disable-next-line
import { BrowserRouter as  Router, Route, Link } from "react-router-dom";
import './Home.css';
import withAuthorization from './withAuthorization';
import { db } from '../firebase';
import Checkout from '../Checkout.js'
import firebase2 from 'firebase/app';

const auth2 = firebase2.auth();
const db2 = firebase2.database();

class HomePage extends Component {
  constructor(props) {
	super(props);
	this.state = {
		users: null,
		uid: auth2.currentUser.uid,
		username: '', // i added
		email: '', //me

	};
  }

  componentDidMount() {
	db.onceGetUsers().then(snapshot =>
	  this.setState({ users: snapshot.val() }),

	);
  }

  render() {
		const { users } = this.state;
		const currentUser = this.state.uid;
		if(!this.state.users){
			return(
			<div>
			<h1>Home</h1>
			No users with meals for sale ):
			</div>);
		}
		const usersList = getUsersWithMeals(users, currentUser);
		return (
			<div>
			<h1 id="home-title">Home</h1>
				<div>
				<h2> Available Passes</h2>
				<table style={tableStyle}>
					<tbody>
						<tr>
							<th id="name">Name</th>
							<th id="price">Price</th>
							<th id="numMeals">Number of Meals</th>
							<th id="location">Dining Hall</th>
							<th id="payment">Payment</th>
						</tr>
						{usersList.map((user) =>
							<tr id="emails" key={user.email}>
								<td headers="name">
									<div>
										{/* Clicking on user leads to user profile */}
										<Link to = {`/${String(user.email)}`}> {user.username} </Link>
									</div>

								</td>
								<td>${parseFloat(user.mealPrice).toFixed(2)}</td>
								<td>{user.numMeals}</td>
								<td>{returnLocation(user.preferredLocation)}</td>
								<td>
									<Checkout
										name={'NOM Meal'}
										description={user.email}
										amount={user.mealPrice}
									/>
								</td>
							</tr>)}
					</tbody>
				</table>
					<div id="avg-price">
						<h3>
						Average Price:
						</h3>
						${avgSellingPrice(users, currentUser)}
					</div>
				</div>


			</div>
		);
  }
}
//returns array of all users with at least 1 meal
function getUsersWithMeals(users, currentUser){
	let usersWithMeals = [];
	for(let i in users){
		if (parseFloat(users[i].numMeals) > 0 && (parseFloat(users[i].mealPrice) > 0)) {
			if (i != null && i != currentUser){
                usersWithMeals.push(users[i]);
            }
        }
	}
	return usersWithMeals;
}


//returns average selling price of meals currently
function avgSellingPrice(users, currentUser){
	let sum = 0;
	let size = 0;
	for(let i in users) {
		if(parseFloat(users[i].mealPrice) > 0) {
			if(i != null && i != currentUser) {
                sum = sum + parseFloat(users[i].mealPrice);
                size++;
            }
		}
	}
	return (sum/size).toFixed(2);
}
function returnLocation(location){
    let userLocation = '';
    switch(location){
        case "location1":
            userLocation = "Porter & Kresge";
            break;
        case "location2":
            userLocation = "Rachel Carson & Oakes";
            break;
        case "location3":
             userLocation = "College 9 & 10";
             break;
        case "location4":
            userLocation = "Cowell & Stevenson";
            break;
        case "location5 ":
            userLocation = "Crown & Merrill";
            break;
        default:
            userLocation = "No given location"
    }
    return userLocation;
}
const tableStyle = {
  border: '3px solid black',
  width: '100%',
};


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);