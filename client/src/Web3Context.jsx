import React, { useState, useEffect, useContext, useRef } from 'react'
import Web3 from 'web3'
import ReactDOM from 'react-dom'
import {
  TODO_LIST_ABI,
  TODO_LIST_ADDRESS,
  USER_ABI,
  USER_ADDRESS,
} from './config'
import { useHistory } from 'react-router-dom'
import TruffleContract from '@truffle/contract'
import UserJSON from './contracts/UserContract.json'
import TodoJSON from './contracts/Todos.json'

export const Web3Context = React.createContext()

let web3Provider

const Web3ContextProvider = props => {
  const history = useHistory()

  const [account, setAccount] = useState()
  const [accountLoading, setAccountLoading] = useState(false)
  const [user, setUser] = useState()
  const [userLoading, setUserLoading] = useState(false)

  const [currentUser, setCurrentUser] = useState(null)
  const [moduleId, setModuleId] = useState(props.moduleId)
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [todos, setTodos] = useState([])
  const [todoCount, setTodoCount] = useState(0)

  const web3Ref = useRef()
  let web3 = web3Ref.current
  const todoContractRef = useRef()
  let todoContract = todoContractRef.current
  const userContractRef = useRef()

  const checkUser = async () => {
    const taskCount = await todoContract.methods.taskCount().call()
    setTodoCount(taskCount)
    let i
    let newtodos = todos
    for (i = 1; i <= taskCount; i++) {
      console.log(i)
      const task = await todoContract.methods.tasks(i).call()
      newtodos = [...newtodos, task]
    }
    setTodos(newtodos)
    setLoading(false)
    console.log(taskCount, todos)
  }

  const loadBlockchainData = async () => {
    setAccountLoading(true)
    web3Provider = Web3.givenProvider || 'http://localhost:7545'
    const web3 = new Web3(web3Provider)
    web3Ref.current = web3
    const accounts = await web3.eth.getAccounts()
    let account = accounts[0];
    setAccount(account)
    setAccountLoading(false)
    const todoContract = new web3.eth.Contract(
      TodoJSON.abi,
      TodoJSON.networks['5777'].address
    )
    const userContract = new web3.eth.Contract(
      UserJSON.abi,
      UserJSON.networks['5777'].address
    )
    todoContractRef.current = todoContract
    userContractRef.current = userContract
    console.log(
      userContractRef,
      todoContractRef,
      accounts,
      accounts[0],
      'user todo'
    )
    if (accounts[0]) {
      setUserLoading(true)
      console.log('Calling checkUser')
      let isAccountRegistered = await userContractRef.current.methods
        .checkUser()
        .call()
      console.log('Calling checkUser', isAccountRegistered)
      if (isAccountRegistered) {
        userContractRef.current.methods
          .login()
          .call()
          .then(name => {
            name = web3.utils.toAscii(name)
            setUser({ address: account, name })
            setUserLoading(false)
          })
      }
      setUserLoading(false)
    }
  }

  const registerUser = async name => {
    name = web3.utils.fromAscii(name)
    console.log(name, userContractRef)
    userContractRef.current.methods
      .signup(name)
      .send({ from: account })
      .once('receipt', receipt => {
        console.log(receipt, 'Register user')
        // setAdding(false)
        if (
          receipt.events.UserCreated &&
          receipt.events.UserCreated.returnValues
        ) {
          let values = receipt.event.UserCreated.returnValues
          setUser({
            address: values.address,
            name: values._name,
            created: values._created,
          })
        }
      })
  }

  const loadUser = async () => {
    console.log(account, 'From the loadBlockchain')
  }

  const addTask = async e => {
    e.preventDefault()
    let value = e.target.task.value
    setAdding(true)
    let df = await todoContract.methods
      .createTask(value)
      .send({ from: account })
      .once('receipt', receipt => {
        console.log(receipt, 'Receipt')
        setAdding(false)
        e.target.task.value = ''
      })
  }

  const toggleTask = async value => {
    let df = await todoContract.methods
      .toggleCompleted(value)
      .send({ from: account })
      .once('receipt', receipt => {
        console.log(receipt, 'Receipt')
      })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  console.log(account, 'Account')

  return (
    <Web3Context.Provider
      value={{
        account,
        accountLoading,
        user,
        userLoading,
        registerUser,
      }}>
      {props.children}
    </Web3Context.Provider>
  )
}

export default Web3ContextProvider

export const useWeb3Context = () => {
  const state = useContext(Web3Context)
  return state
}
