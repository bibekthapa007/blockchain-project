import React, { Children, useContext } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { useWeb3Context, Web3Context } from '../Web3Context'
import Dashboard from './Dashboard'
import Login from './Login'
import NoAccount from './NoAccount'
import Signup from './Signup'

function UserRoute({ children, ...rest }) {
  let { account, accountLoading, user, userLoading } = useWeb3Context()
  // console.log(user, 'User', account)
  if (accountLoading) {
    return 'Loading the data from metamask.'
  }
  if (!accountLoading && account) {
    if (userLoading) {
      return 'Loading the user'
    } else if (!userLoading && user) {
      return children
    } else {
      return <Signup />
    }
  } else {
    return <Login />
  }
}

export default withRouter(UserRoute)
