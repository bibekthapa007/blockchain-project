const Products = artifacts.require('ProductContract');
const Users = artifacts.require('UserContract');

module.exports = function (deployer) {
  deployer.deploy(Users);
  deployer.deploy(Products);
};
