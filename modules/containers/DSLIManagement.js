/*
* Name : DSLIManagment.js
* Location : ./modules/containers/
*
* History :
*
* Version         Date           Programmer
* =================================================
* 0.1.0           2016-07-30   Roberto D'Amico
* -------------------------------------------------
* Codifica modulo
* =================================================
*/
import React, { Component, PropTypes } from 'react'
import * as actions from '../actions/RootAction'
import Modal from 'react-modal'
import Components from '../components'
const {MTextBox, MButton, MAdminDSLIRow} = Components

class DSLIManagment extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
  }

  render() {
    const { store } = this.context
    let comp = store.getState().DSLIList

    let body = []
    let i
    let n = comp.length;
    for (i = 0; i < n; i++) {
      if(comp[i].permits > 0)
        body[i] = <MAdminDSLIRow data = {comp[i]} showPermits = {true}/>
    }
    return (
  	  <div>
        <h2>DSLI Managment</h2>
        <div className="table-responsive">
          <table id="mytable" className="table table-bordred table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Last Modified</th>
                <th>Author</th>
                <th>Access level</th>
                <th>Edit</th>
                <th>Publish</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {body}
            </tbody>
          </table>
        </div>

        {this.warn}
      </div>
  	)
  }
}

DSLIManagment.contextTypes = {
  store : React.PropTypes.object
}

export default DSLIManagment
