import Arweave from 'arweave'
import { JWKInterface } from 'arweave/node/lib/wallet'
import { ApiConfig } from 'arweave/node/lib/api'
import fs from 'fs'

const defaultArweaveOptions = {
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
}

class SwHelper {
  arweave: Arweave
  wallet: JWKInterface

  constructor (walletPath: string, arweaveConfig: ApiConfig) {
    const rawWallet = fs.readFileSync(walletPath, 'utf-8')
    this.wallet = JSON.parse(rawWallet)

    const config = this.getConfig(arweaveConfig)
    this.arweave = Arweave.init(config)
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
