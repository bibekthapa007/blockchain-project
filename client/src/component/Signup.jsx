import React from 'react'
import { useWeb3Context } from '../Web3Context'

function Signup() {
  let { account, registerUser } = useWeb3Context()
  return (
    <div>
      <h5>Your account is {account}</h5>
      <form
        onSubmit={e => {
          e.preventDefault()
          let name = e.target.name.value
          registerUser(name)
        }}>
        <h5>Fill the form to register as new user.</h5>
        <div>
          <label>Name</label>
          <input name="name" required />
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Signup
