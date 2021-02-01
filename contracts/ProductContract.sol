// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract ProductContract {
  uint256 public productCount = 0;
  address public productAddress;
  uint256 public nextId = 0;

  struct Product {
    uint256 id;
    address sellerAddress;
    string name;
    string description;
    string imageId;
    bool bought;
    address userAddress;
  }

  mapping(uint256 => Product) public products;

  event ProductCreated(
    uint256 id,
    address sellerAddress,
    string name,
    string description,
    string imageId,
    bool bought
  );

  event ProductBought(uint256 id, bool bought);

  mapping(address => uint256[])  sellerProductId;
  mapping(address => uint256[])  boughtProductId;

  uint256[] public  allProductId;
  uint256[] public  availableProductId;

  modifier onlyValidName(bytes32 name) {
    // Only valid names allowed
    require(!(name == 0x0), 'Name not valid');
    _;
  }

  constructor() public {
    productAddress = address(this);
  }

  function createProduct(
    string memory _name,
    string memory _description,
    string memory _imageId
  ) public {
    bytes memory tempName = bytes(_name); // Uses memory
    require(!(tempName.length == 0), 'Valid name required.');
    products[nextId] = Product(
      nextId,
      msg.sender,
      _name,
      _description,
      _imageId,
      false,
      address(0)
    );
    sellerProductId[msg.sender].push(nextId);
    availableProductId.push(nextId);
    emit ProductCreated(
      nextId,
      msg.sender,
      _name,
      _description,
      _imageId,
      false
    );
    productCount++;
    nextId++;
  }

  function getProductById(uint256 _id)
    public
    view
    returns (
      uint256 _uid,
      address _sellerAddress,
      string memory _name,
      string memory _description,
      string memory _imageId,
      bool bought
    )
  {
    Product memory _p = products[_id];
    require(!(_sellerAddress == address(0)), 'Product doesnot exit.');
    return (
      _p.id,
      _p.sellerAddress,
      _p.name,
      _p.description,
      _p.imageId,
      _p.bought
    );
  }

  function buyProduct(uint256 _id) public {
    Product memory _product = products[_id];
    require(!_product.bought, 'Product already bought.');
    require(
      msg.sender == _product.sellerAddress,
      'Cannot buy your own product.'
    );
    _product.bought = true;
    products[_id] = _product;
    uint256[] storage aid = boughtProductId[msg.sender];
    aid.push(productCount - 1);
    emit ProductBought(_id, _product.bought);
  }

  function getAvailableProductId() public view returns (uint256[] memory ids) {
    return availableProductId;
  }

  function getSellerProductId() public view returns (uint256[] memory ids) {
    return sellerProductId[msg.sender];
  }

  function getBoughtProductId() public view returns (uint256[] memory ids) {
    return boughtProductId[msg.sender];
  }
}
