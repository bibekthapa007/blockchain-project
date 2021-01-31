const Todos = artifacts.require('Todos');
const Users = artifacts.require('UserContract');

module.exports = function (deployer) {
  deployer.deploy(Users);
  deployer.deploy(Todos);
};
