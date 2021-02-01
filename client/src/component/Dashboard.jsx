import React from 'react'
import { useWeb3Context } from '../Web3Context'

function Dashboard() {
  let { user } = useWeb3Context()
  return (
    <div>
      <div>This is dashboard. </div>
      <div> Name: {user.name} </div>
      <div> address: {user.address} </div>
    </div>
  )
}

export default Dashboard
