import { config, ethersErrorCodes } from "@/constants";
import { Contract, ethers } from "ethers";
import type { ContractName } from "@uma/contracts-node";
import { getAbi, getAddress as getContractAddress } from "@uma/contracts-node";

export const formatEther = ethers.utils.formatEther;

export const parseEther = ethers.utils.parseEther;

/** Catches any potential errors form parsing an unknown string value, returns 0 if error happens.
 * @param value - the value to parse
 * @param decimals - the number of decimals to parse to, defaults to 18
 */
export function parseEtherSafe(value: string, decimals = 18): ethers.BigNumber {
  try {
    // previously we were casting this to number, and using tofixed. this does not work because casting to
    // number may change the value. this was affecting the "max" button when decimals of user was very long.
    return ethers.utils.parseUnits(value, decimals);
  } catch (err) {
    return ethers.BigNumber.from(0);
  }
}

export const solidityKeccak256 = ethers.utils.solidityKeccak256;

export const randomBytes = ethers.utils.randomBytes;

export const toUtf8String = ethers.utils.toUtf8String;

export const formatBytes32String = ethers.utils.formatBytes32String;

export const commify = ethers.utils.commify;

export const zeroAddress = ethers.constants.AddressZero;

export const getAddress = ethers.utils.getAddress;

export const isAddress = ethers.utils.isAddress;

export const oneEth = ethers.BigNumber.from("1000000000000000000");

export const maximumApprovalAmount = ethers.constants.MaxUint256;

/**
 * Matches given text against the list of known ethers error codes.
 * @param text - the text to match
 * @returns true if the text matches an error code, false otherwise
 */
export function isEthersError(text: string) {
  return ethersErrorCodes.some((code) => text.includes(code));
}

/**
 * Parses an ethers error into a message part and a link part.
 * Conforms to the `ErrorMessage` type.
 * @param ethersError - the error to parse
 * @returns the parsed error
 */
export function parseEthersError(ethersError: string) {
  const [firstPart, secondPart] = ethersError.split("[");

  const text = firstPart.trim();

  const href = secondPart.replace("See:", "").replace("]", "").trim();

  return {
    text,
    link: {
      text: "Learn more",
      href,
    },
  };
}

export function getProvider(chainId: number) {
  const rpc = config.providers.find((p) => p.chainId === chainId)?.url;
  return new ethers.providers.JsonRpcProvider(rpc);
}

export async function getContract(contractName: ContractName, chainId: number) {
  const contractAddress = await getContractAddress(contractName, chainId);

  if (!contractAddress)
    throw Error(`Unable to resolve address for ${contractName}`);

  return new Contract(
    contractAddress,
    getAbi(contractName),
    getProvider(chainId),
  );
}
