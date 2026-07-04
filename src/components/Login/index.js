import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {username: '', password: '', error: ''}

  onSubmit = async e => {
    e.preventDefault()
    const {username, password} = this.state

    const response = await fetch('https://apis.ccbp.in/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    })

    const data = await response.json()

    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props

      history.replace('/')
    } else {
      this.setState({error: data.error_msg})
    }
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token !== undefined) return <Redirect to="/" />

    const {error} = this.state

    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />

        <form onSubmit={this.onSubmit}>
          <label htmlFor="username">USERNAME</label>
          <input
            id="username"
            type="text"
            onChange={e => this.setState({username: e.target.value})}
          />

          <label htmlFor="password">PASSWORD</label>
          <input
            id="password"
            type="password"
            onChange={e => this.setState({password: e.target.value})}
          />

          <button type="submit">Login</button>

          {error && <p>{error}</p>}
        </form>
      </div>
    )
  }
}

export default Login
