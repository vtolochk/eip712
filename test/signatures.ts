import { IDefaultStructure, buildDefaultStructure, buildDefaultStructureMetmask } from "./types";
import { signTypedData, SignTypedDataVersion } from "@metamask/eth-sig-util";
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { Wallet } from "ethers";

interface ISigner {
  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ) : Promise<string>;
  getChainId(): Promise<number>;
}

export async function signHardhat(signer: ISigner,  verifyingContract: string, data: IDefaultStructure) {
  const chainId = await signer.getChainId();
  const { domain, message, types } = buildDefaultStructure(chainId, verifyingContract, data);

  return signer._signTypedData(domain, types, message);
}

export async function signMetamask(signer: Wallet, verifyingContract: string, structureData: IDefaultStructure) {
  const chainId = await signer.getChainId();
  const params = buildDefaultStructureMetmask(chainId, verifyingContract, structureData);
  const callParams = {
    privateKey: Buffer.from(signer.privateKey),
    data: params,
    version: SignTypedDataVersion.V4
  }

  return signTypedData(callParams);
}
