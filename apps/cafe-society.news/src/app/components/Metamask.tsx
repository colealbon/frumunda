import { useMetaMask } from "metamask-react";
export function Metamask() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  
  if (status === "initializing") return <div>Synchronisation with MetaMask ongoing...</div>

  if (status === "unavailable") return <div>MetaMask not available :(</div>

  if (status === "notConnected") return <button onClick={connect}>Connect to MetaMask</button>

  if (status === "connecting") return <div>Connecting...</div>

  if (status === "connected") return <div>Connected account {account} on chain ID {chainId}</div>

  return <>are you threatening me?</>;
  
}
export default Metamask;
