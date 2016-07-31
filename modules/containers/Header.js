import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import ErrDisplay from '../components/ErrDisplay'
import * as actions from '../actions/RootAction'
import NavLink from '../components/NavLink'
import MainPage from './MainPage'

class Header extends Component {
  render() {
    const {store} = this.context
    let list
    if(store.getState().auth == 1){
      list =
      <div id="mainmenu">
        <ul role="nav" id="menu">
				    <li><IndexLink to="/" activeClassName="active">MainPage</IndexLink></li>
            <li><NavLink to="/list">List</NavLink ></li>
            <li><NavLink
              onClick = {() => {
                store.dispatch(actions.getProfile(store))
              }}
            to="/profile">Profile</NavLink ></li>
            <li><NavLink
              onClick = {() => {
                store.dispatch(actions.logout())
              }}
            to="/">LogOut</NavLink ></li>
			  </ul>
		  </div>
    }
    else{
      list =
      <div id="mainmenu">
        <ul role="nav" id="menu">
				    <li><IndexLink to="/" activeClassName="active">MainPage</IndexLink></li>
            <li><NavLink to="/signIn">Sign in</NavLink ></li>
            <li><NavLink to="/login">Login</NavLink ></li>
            <li><NavLink to="/list">List</NavLink ></li>
			  </ul>
		  </div>
    }

    return (
      <div id="header">
		<div id="headerText">
			<h1>MaaS: MongoDB as an admin Service</h1>
        </div>
		{list}
    <div id="errors">
      <ErrDisplay/>
    </div>
		<div id="content">
			{this.props.children || <Home/>}
		</div>
      </div>
    )
  }
}

Header.contextTypes = {
  store : React.PropTypes.object
}

export default Header