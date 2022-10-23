// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

import "hardhat/console.sol";

contract EIP712Example is EIP712 {
  using ECDSA for bytes32;

  struct DefaultStructure {
    string name;
    address[] users;
    uint256 userCount;
  }

  address private owner;
  DefaultStructure private dataStorage;
  bytes private DS_TYPEHASH = "DefaultStructure(string name,address[] users,uint256 userCount)";

  constructor(string memory name, string memory version, address _owner) EIP712(name, version){
    owner = _owner;
  }

  function verifyDS(DefaultStructure calldata ds, bytes memory signature) external {
    bytes32 structHash = hashDS(ds);
    address recovered = ECDSA.recover(structHash, signature);
    require(owner == recovered, "Recovered is not owner!");
    dataStorage = ds;
  }

  function hashDS(DefaultStructure calldata ds) public view returns (bytes32) {
    return keccak256(abi.encode(
      DS_TYPEHASH,
      keccak256(bytes(ds.name)),
      keccak256(abi.encodePacked(ds.users)),
      ds.userCount
    ));
  }

  function getDataStorage() external view returns (DefaultStructure memory ds) {
    return dataStorage;
  }
}
