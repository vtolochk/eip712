import { expect } from "chai";
import { ethers } from "hardhat";
import { signHardhat } from "./signatures";

describe('EIP712', function () {
  async function EIP712Fixture() {
    const [owner, second, third, fourth] = await ethers.getSigners();
    const { address: ownerAddress } = owner;
    const { address: secondAddress } = second;
    const { address: thirdAddress } = third;
    const { address: fourthAddress } = fourth;
    const users = [secondAddress, thirdAddress, fourthAddress]

    const domainName = "EIP712Example";
    const Factory = await ethers.getContractFactory("EIP712Example");
    const eip712 = await Factory.deploy(domainName, "1", ownerAddress);
    const { address: eip712address } = eip712;
    const name = "Valentyn"
    const data = {
      name,
      users,
      userCount: 3
    }
    const signature = await signHardhat(owner, eip712address, data);

    return { eip712, signature, owner, ownerAddress, data, users, name };
  }

  it("successfully saves data to storage", async () => {
    const { eip712, signature, name, owner, users, ownerAddress, data } = await EIP712Fixture();
    await eip712.verifyDS(data, signature);
    const dataStorage = await eip712.getDataStorage();
    expect(dataStorage.name).to.be.eql(name);
    expect(dataStorage.users).to.be.eql(users);
    expect(dataStorage.userCount).to.be.eql(3);
  })
})
