// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

/// @dev basic authentication contract
/// @notice tracks list of all users

contract UserContract {
  struct User {
    string name;
    uint256 created_at;
  }

  event UserCreated(
    address indexed _address,
    string _name,
    uint256 _created_at
  );
  event UserUpdated(address indexed _address, string _name);
  event UserDeleted(address indexed _address);

  mapping(address => User) private users;

  // public array that contains list of all users that have registered
  address[] public allUsers;
  modifier onlyExistingUser {
    // Check if user exists or terminate
    bytes memory tempName = bytes(users[msg.sender].name); // Uses memory
    require(tempName.length != 0, 'User not exit.');
    _;
  }

  modifier onlyValidName(string memory name) {
    // Only valid names allowed
    bytes memory tempName = bytes(name);
    require(tempName.length != 0, 'Name not valid');
    _;
  }

  /// @return username
  function login() public view onlyExistingUser returns (string memory) {
    return (users[msg.sender].name);
  }

  /// @param name the username to be created.
  /// @dev checks if user exists
  /// If yes return user name
  /// If no, check if name was sent
  /// If yes, create and return user
  /// @return username of created user
  function signup(string memory name)
    public
    payable
    onlyValidName(name)
    returns (string memory)
  {
    bytes memory tempName = bytes(users[msg.sender].name);
    require(tempName.length == 0, 'User already registered.');
    users[msg.sender].name = name;
    users[msg.sender].created_at = block.timestamp;
    allUsers.push(msg.sender);
    emit UserCreated(msg.sender, name, block.timestamp);
    return (users[msg.sender].name);
  }

  function update(string memory name)
    public
    payable
    onlyValidName(name)
    onlyExistingUser
    returns (string memory _username)
  {
    // Update user name.

    users[msg.sender].name = name;
    emit UserUpdated(msg.sender, name);
    return (users[msg.sender].name);
  }

  /// @dev destroy existing username
  function destroy() public onlyExistingUser {
    delete users[msg.sender];
    emit UserDeleted(msg.sender);
  }

  function checkUser() public view returns (bool) {
    bytes memory tempName = bytes(users[msg.sender].name);
    return (tempName.length != 0);
  }
}
