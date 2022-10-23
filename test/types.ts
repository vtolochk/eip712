import { MessageTypes, TypedMessage } from "@metamask/eth-sig-util"

const DefaultStructureType = [
  {name: 'name', type: 'string'},
  {name: 'users', type: 'address[]'},
  {name: 'userCount', type: 'uint256'},
]

const EIP712DomainType = [
  {name: 'name', type: 'string'},
  {name: 'version', type: 'string'},
  {name: 'chainId', type: 'uint256'},
  {name: 'verifyingContract', type: 'address'},
]

export interface IDefaultStructure {
  name: string;
  users: string[];
  userCount: number;
}

export function buildDefaultStructure(chainId: number, verifyingContract: string, data: IDefaultStructure) {
  return {
    domain: {
      name: "EIP712Example",
      version: "1",
      chainId,
      verifyingContract,
    },
    message: data,
    primaryType: "DefaultStructure",
    types: {
      DefaultStructure: DefaultStructureType
    },
  }
}

export function buildDefaultStructureMetmask(chainId: number, verifyingContract: string, data: IDefaultStructure): TypedMessage<MessageTypes> {
  const signatureObject = buildDefaultStructure(chainId, verifyingContract, data)
  return {
    ...signatureObject,
    types: {
      ...signatureObject.types,
      EIP712Domain: EIP712DomainType
    }
  }
}
