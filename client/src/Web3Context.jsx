import React, { useState, useEffect, useContext, useRef } from 'react'
import Web3 from 'web3'
import ReactDOM from 'react-dom'
import { useHistory } from 'react-router-dom'
import TruffleContract from '@truffle/contract'
import UserJSON from './contracts/UserContract.json'
import ProductJSON from './contracts/ProductContract.json'

const port = 5777

export const Web3Context = React.createContext()

let web3Provider

const Web3ContextProvider = props => {
  const history = useHistory()

  const [account, setAccount] = useState()
  const [accountLoading, setAccountLoading] = useState(false)
  const [user, setUser] = useState()
  const [userLoading, setUserLoading] = useState(false)

  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [products, setProducts] = useState()
  const [sellerProducts, setSellerProducts] = useState()
  const [boughtProducts, setBoughtProducts] = useState()

  const [productCount, setProductCount] = useState(0)

  const web3Ref = useRef()
  let web3 = web3Ref.current
  const productContractRef = useRef()
  let productContract = productContractRef.current
  const userContractRef = useRef()

  const loadBlockchainData = async () => {
    setAccountLoading(true)
    web3Provider = Web3.givenProvider || 'http://localhost:7545'
    const web3 = new Web3(web3Provider)
    web3Ref.current = web3
    const accounts = await web3.eth.getAccounts()
    let account = accounts[0]
    setAccount(account)
    setAccountLoading(false)
    const productContract = new web3.eth.Contract(
      ProductJSON.abi,
      ProductJSON.networks[port].address
    )
    const userContract = new web3.eth.Contract(
      UserJSON.abi,
      UserJSON.networks[port].address
    )
    productContractRef.current = productContract
    userContractRef.current = userContract
    console.log(
      userContractRef,
      productContractRef,
      accounts,
      accounts[0],
      'user todo'
    )
    if (accounts[0]) {
      setUserLoading(true)
      console.log('Calling checkUser')
      userContractRef.current.methods.checkUser().call().then(isAccountRegistered => {
        console.log('Calling checkUser', isAccountRegistered)
        if (isAccountRegistered) {
          userContractRef.current.methods
            .login()
            .call()
            .then(name => {
              setUser({ address: account, name })
              setUserLoading(false)
            })
        }
        setUserLoading(false)
      })
    }
  }

  const registerUser = async name => {
    console.log(name, userContractRef)
    userContractRef.current.methods
      .signup(name)
      .send({ from: account })
      .then(receipt => {
        console.log(receipt, 'Register user')
        if (
          receipt.events.UserCreated &&
          receipt.events.UserCreated.returnValues
        ) {
          let values = receipt.events.UserCreated.returnValues
          setUser({
            address: values.address,
            name: values._name,
            created: values._created,
          })
          console.log(values)
        }
      })
      .catch(e => {
        console.log(e, 'error')
      })
  }

  console.log(user, 'User')
  const loadUser = async () => {
    console.log(account, 'From the loadBlockchain')
  }

  const addTask = async e => {
    e.preventDefault()
    let value = e.target.task.value
    setAdding(true)
    let df = await productContract.methods
      .createTask(value)
      .send({ from: account })
      .once('receipt', receipt => {
        console.log(receipt, 'Receipt')
        setAdding(false)
        e.target.task.value = ''
      })
  }

  const toggleTask = async value => {
    let df = await productContract.methods
      .toggleCompleted(value)
      .send({ from: account })
      .once('receipt', receipt => {
        console.log(receipt, 'Receipt')
      })
  }

  const getAvailableProducts = async () => {
    const availableProduct = await productContract.methods
      .getAvailableProductId()
      .call()
    console.log(availableProduct, 'Avauilable product id')
    let newProducts = products || []
    await Promise.all(
      availableProduct.map(async id => {
        const product = await productContract.methods.products(id).call()
        console.log(product)
        newProducts = [...newProducts, product]
      })
    )
    setProducts(newProducts)
  }

  const getSellerProducts = async () => {
    const sellerProduct = await productContract.methods
      .getSellerProductId()
      .call()
    console.log(sellerProduct, 'Seller Product Id')
    let newProducts = products || []
    console.log(newProducts, 'New pl')
    await Promise.all(
      sellerProduct.map(async id => {
        const product = await productContract.methods.products(id).call()
        newProducts = [...newProducts, product]
      })
    )
    setSellerProducts(newProducts)
    return products
  }
  const getBoughtProducts = async () => {
    const boughtProduct = await productContract.methods
      .getBoughtProductId()
      .call()
    console.log(boughtProduct, 'Buyer Product Id')
    let newProducts = products || []
    console.log(newProducts, 'New pl')
    await Promise.all(
      boughtProduct.map(async id => {
        const product = await productContract.methods.products(id).call()
        newProducts = [...newProducts, product]
      })
    )
    setBoughtProducts(newProducts)
  }

  const addProduct = async (name, description, imageId) => {
    await productContract.methods
      .createProduct(name, description, imageId)
      .send({ from: account })
      .then(receipt => {
        console.log(receipt)
        let values = receipt.events.ProductCreated.returnValues
        console.log(values)
        let oldProducts = products || []
        console.log(oldProducts, 'OldPRoduc', values)
        setProducts([...oldProducts, values])
      })
      .catch(e => {
        console.log(e, 'add error')
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
        products,
        sellerProducts,
        boughtProducts,
        getAvailableProducts,
        getSellerProducts,
        getBoughtProducts,
        addProduct,
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
