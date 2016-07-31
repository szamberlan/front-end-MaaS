import React, { Component, PropTypes } from 'react'
import * as actions from '../actions/RootAction'
import MTextBox from '../components/MTextBox'
import NavLink from '../components/NavLink'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
  }

  render() {
    const { store } = this.context
    return (
  	  <div>
        <h2>Profile</h2>
        <p>{store.getState().profile.email}</p>
        <p>{store.getState().profile.name}</p>
        <div>
          <img src={'https://s-media-cache-ak0.pinimg.com/564x/d7/6c/1a/d76c1a251031aa7e8a99660f056ac689.jpg'} alt="boohoo" className="img-responsive"/>
        </div>

        {this.warn}

        <button
          type = "button"
          onClick = {() => {
            store.dispatch(actions.attemptLogin(store, this.name, this.owner))
          }}>
          CAMBIA IMMAGINE
        </button>
        <button
          type = "button"
          onClick = {() => {
            store.dispatch(actions.redirect('/profile/changepwd'))
          }}>
          CAMBIA PASSWORD
        </button>
      </div>
  	)
  }
}

Profile.contextTypes = {
  store : React.PropTypes.object
}

export default Profile