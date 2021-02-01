import React, { useEffect } from 'react'
import { useWeb3Context } from '../Web3Context'

function Dashboard() {
  let {
    account,
    user,
    getAvailableProducts,
    products,
    sellerProducts,
    boughtProducts,
    getSellerProducts,
    getBoughtProducts,
    addProduct,
    buyProduct,
  } = useWeb3Context()

  useEffect(() => {
    getAvailableProducts()
    getSellerProducts()
    getBoughtProducts()
  }, [])

  return (
    <div>
      <div></div>
      <h5>This is dashboard. </h5>
      <div> Name: {user.name} </div>
      <div> address: {user.address} </div>
      <AvailableProduct
        products={products}
        buyProduct={buyProduct}
        account={account}
      />
      <div></div>
      <SellerProduct sellerProducts={sellerProducts} />
      <BoughtProduct boughtProducts={boughtProducts} />
      <AddProduct addProduct={addProduct} />
    </div>
  )
}

const AvailableProduct = ({ products, buyProduct, account }) => {
  if (!products) {
    return 'Loading product...'
  } else if (products.length === 0) {
    return 'No Product'
  } else {
    return (
      <div>
        <h5>Available Product</h5>
        {products.map((p, index) => {
          return (
            <div key={p.id || index}>
              <div>{p.id}</div>
              <div>{p.name}</div>
              <div>{p.description} </div>
              {account === p.sellerAddress ? (
                <button onClick={buyProduct}>Edit Product(Coming Soon)</button>
              ) : (
                <button onClick={buyProduct}>Buy Product</button>
              )}
            </div>
          )
        })}
      </div>
    )
  }
}

const SellerProduct = ({ sellerProducts, buyProduct }) => {
  if (!sellerProducts) {
    return 'Loading seller product...'
  } else if (sellerProducts.length === 0) {
    return 'No Product'
  } else {
    return (
      <div>
        <h5>Seller Product</h5>
        {sellerProducts.map((p, index) => {
          return (
            <div key={p.id || index}>
              <div>{p.id}</div>
              <div>{p.name}</div>
              <div>{p.description} </div>
            </div>
          )
        })}
      </div>
    )
  }
}

const BoughtProduct = ({ boughtProducts }) => {
  if (!boughtProducts) {
    return 'Loading seller product...'
  } else if (boughtProducts.length === 0) {
    return 'No Product'
  } else {
    return (
      <div>
        <h5>Bought Product</h5>
        {boughtProducts.map((p, index) => {
          return (
            <div key={p.id || index}>
              <div>{p.id}</div>
              <div>{p.name}</div>
              <div>{p.description} </div>
            </div>
          )
        })}
      </div>
    )
  }
}

function AddProduct({ addProduct }) {
  const handleForm = async e => {
    e.preventDefault()
    let name = e.target.name.value
    let description = e.target.description.value
    let imageId = e.target.imageId.value
    console.log(name, description, imageId, 'Values')
    addProduct(name, description, imageId)
    e.target.reset()
  }
  return (
    <div>
      <h5>Add the Product</h5>
      <div></div>
      <form onSubmit={handleForm}>
        <div>
          <label>Name</label>
          <input name="name" required />
        </div>
        <div>
          <label>Description</label>
          <input name="description" required />
        </div>
        <div>
          <label>ImageId</label>
          <input name="imageId" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Dashboard
