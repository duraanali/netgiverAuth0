import React, { PropTypes as T } from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap'
import AuthService from '../../../utils/AuthService'
import styles from './styles.module.css'

export class Login extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }
  // We’ll add a constructor that checks if the user is already logged in or not and redirects to the home page when a user is logged in.
  constructor(props, context) {
    super(props, context)
    this.state = {
      profile: props.auth.getProfile()
    }
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({ profile: newProfile })
      this.context.router.push('/home');
    })
  }

  render() {
    const { auth } = this.props
    if (this.state.profile.user_id) {
      this.context.router.push('/home');
    }
    // Where in the seed project, there is only one login method, here we implement a login button for each of the three passwordless login methods we are going to be working with.
    return (
      <div className={styles.root}>
        <h2>Login</h2>
        <ButtonToolbar className={styles.toolbar}>
          <Button bsStyle="primary" onClick={auth.loginMagiclink.bind(this)}>Login with Magiclink</Button>
          <Button bsStyle="primary" onClick={auth.loginEmailCode.bind(this)}>Login with Email Code</Button>
          <Button bsStyle="primary" onClick={auth.loginSMSCode.bind(this)}>Login with SMS Code</Button>
        </ButtonToolbar>
      </div>
    )
  }
}

export default Login;