import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import AuthService from './utils/AuthService'
import Container from './views/Main/Container'
import Home from './views/Main/Home/Home'
import Login from './views/Main/Login/Login'

const auth = new AuthService('kW0w0ej0qpY2pWPU0BXeDV6BK8fVBvfP', 'dev-2lmqt1n7.auth0.com');

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

export const makeMainRoutes = () => {
  return (
    <Route path="/" component={Container} auth={auth}>
      <IndexRedirect to="/home" />
      <Route path="home" component={Home} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="access_token=:token" component={Login} /> //to prevent router errors
    </Route>
  )
}

export default makeMainRoutes
