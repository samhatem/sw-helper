import Arweave from 'arweave'
import { JWKInterface } from 'arweave/node/lib/wallet'
import { ApiConfig } from 'arweave/node/lib/api'
import fs from 'fs'
import { createContract, interactWrite } from 'smartweave'

const defaultArweaveOptions = {
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
}

class SwHelper {
  arweave: Arweave
  wallet: JWKInterface
  contractId: string

  /**
   * Initialize the helper
   * @param walletPath    The path to a wallet private key
   * @param arweaveConfig Optional. The api config for the arweave js instance
   */
  constructor (walletPath: string, arweaveConfig?: ApiConfig) {
    // TO DO: generate a wallet if none if provided for dry runs

    const rawWallet = fs.readFileSync(walletPath, 'utf-8')
    this.wallet = JSON.parse(rawWallet)

    const config = this.getConfig(arweaveConfig)
    this.arweave = Arweave.init(config)
  }

  /**
   * Create a contract
   * @param contractSrc   The source code of the contract as a string.
   * @param initState     The initial state of the contract.
   */
  async createContract (contractSrc: string, initState: string) {
    return await createContract(this.arweave, this.wallet, contractSrc, initState)
  }

  /**
   * Set a contract id so it can be used in future calls
   * @param id            The id of the contract.
   */
  setContract (id: string) {
    this.contractId = id
  }

  /**
   * Write an interaction to a contract
   * @param input         The interaction input. It will be serialized as JSON.
   * @param contractId    The id of the contract to write to. If not provided, will default to the id set by setContract.
   */
  async interactWrite (input: any, contractId?: string) {
    if (!contractId && !this.contractId) {
      throw new Error('You must specify a contractId to create an interaction.')
    }

    const contract = contractId || this.contractId

    return await interactWrite(this.arweave, this.wallet, contract, input)
  }

  private getConfig (config: ApiConfig) {
    return {
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
      ...config
    }
  }
}

export default SwHelper
