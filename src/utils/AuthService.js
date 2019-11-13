import { EventEmitter } from 'events'
import { isTokenExpired } from './jwtHelper'
import Auth0LockPasswordless from 'auth0-lock-passwordless';
export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super()
    // Configure Auth0 Passwordless
    // We’ll get the clientId and domain credentials from our .env file we created
    this.lock = new Auth0LockPasswordless(clientId, domain)

    // The lock.parseHash function will check to see if we clicked a magiclink and if so, parse the required information to verify the authentication. If the expected hash is not found, it will be ignored.
    this.hash = this.lock.parseHash(window.location.hash);
    if (this.hash && this.hash.error) {
      this._authorizationError()
    } else if (this.hash && this.hash.idToken) {
      this._doAuthentication();
    }
    // Here we set the three different authentication options and make them available to use in our template.
    this.loginMagiclink = this.loginMagiclink.bind(this);
    this.loginEmailCode = this.loginEmailCode.bind(this);
    this.loginSMSCode = this.loginSMSCode.bind(this);
  }

  // The _doAuthentication function will get the user profile information if authentication is successful
  _doAuthentication(err, token) {
    if (this.hash) {
      localStorage.setItem('id_token', this.hash.idToken);
      // The setProfile function sets the user profile information in localStorage
      this.lock.getProfile(this.hash.idToken, this.setProfile.bind(this));
    } else {
      localStorage.setItem('id_token', token.idToken);
      this.lock.getProfile(token.idToken, this.setProfile.bind(this));
    }
  }

  // We’ll display an error if the user clicks an outdated or invalid magiclink
  _authorizationError() {
    alert('There was an error: ' + this.hash.error + '\n' + this.hash.error_description);
  }

  // The next three function implement our three authentication options
  // loginMagiclink - sends the user an email with a link they must click to authenticate
  // loginEmailCode - sends the user an email with a one-time passcode they must enter to authenticate
  // loginSMSCode - sends the user an SMS text message with a one-time passcode they must enter to authenticate
  loginMagiclink() {
    // Ask a user for an email address and send a magiclink that they will need to click on to authenticate
    this.lock.magiclink();
  }
  loginEmailCode() {
    // Ask a user for an email address and send them a one-time passcode to authenticate
    // Here we are also setting the autoclose property to true, meaning once a user is authenticated the lock
    // modal will automatically close.
    this.lock.emailcode({ autoclose: true }, this._doAuthentication.bind(this));
  }
  loginSMSCode() {
    // Ask a user for a phone number and send them a one-time passcode to authenticate
    // Here we are setting the autoclose property to false, meaning once a user is authenticated the lock
    // modal will display a message to the user saying they are succesfully logged in but the user will have to
    // close the modal on their own.
    this.lock.sms({ autoclose: true }, this._doAuthentication.bind(this));
  }

  // The rest of the functions below are helper functions that we borrow from the seed project.
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token && !isTokenExpired(token)
  }
  setProfile(err, profile) {
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile)
  }
  getProfile() {
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }
  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }
  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }
  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }
}