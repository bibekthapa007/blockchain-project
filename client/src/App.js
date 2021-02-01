import { useState, useEffect, useRef } from 'react'
import Web3 from 'web3'
import './App.css'
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './config'
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'
import Login from './component/Login'
import Signup from './component/Signup'
import NoAccount from './component/NoAccount'
import Web3ContextProvider from './Web3Context'
import Dashboard from './component/Dashboard'
import UserRoute from "./component/UserRoute";

function App() {
  return (
    <Web3ContextProvider>
      <Router>
        <Switch>
          <UserRoute exact path="/">
            <Dashboard />
          </UserRoute>
          <Route path={`/login/`}>
            <Login />
          </Route>
          <Route path={`/signup/`}>
            <Signup />
          </Route>
          <Route path={`/noAccount/`}>
            <NoAccount />
          </Route>
        </Switch>
      </Router>
    </Web3ContextProvider>

    // <div className="container">
    //   <h1>Blockchain </h1>
    //   <p>Your account: {account} </p>

    //   <form onSubmit={addTask}>
    //     <input name="task" className="" />
    //     <button type="submit">Submit</button>
    //   </form>

    //   {loading ? (
    //     ' Loaidng...'
    //   ) : (
    //     <div>
    //       Total = {todoCount}
    //       {todos.map(t => {
    //         return (
    //           <div key={t.id} >
    //             <input
    //               type="checkbox"
    //               checked={t.completed}
    //               onChange={e => {
    //                 toggleTask(t.id)
    //               }}
    //             />
    //             {t.content}
    //           </div>
    //         )
    //       })}
    //     </div>
    //   )}
    // </div>
  )
}


export default App
// cp -r ../build/contracts ./src