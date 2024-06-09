import { http, createConfig } from "wagmi";
import { lukso } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { type Chain } from "viem";

export const luksotest = {
  id: 4201,
  name: "LUKSO Testnet",
  nativeCurrency: {
    name: "LUKSO",
    symbol: "	LYXt",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.lukso.network"],
      webSocket: ["wss://ws-rpc.testnet.lukso.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "LUKSO Testnet Explorer",
      url: "https://explorer.execution.testnet.lukso.network",
      apiUrl: "https://explorer.execution.mainnet.lukso.network/api",
    },
  },
} as const satisfies Chain;

const connectorTest = injected({
  target() {
    const provider = typeof window !== "undefined" ? window.lukso : undefined;
    return {
      id: "windowProvider",
      name: "Universal Profile",
      provider: provider,
      icon: "https://lukso.network/favicon.ico"
    }
  },
});

export const config = createConfig({
  chains: [luksotest, lukso],
  connectors: [connectorTest],
  ssr: true,
  multiInjectedProviderDiscovery: false, 
  transports: {
    [luksotest.id]: http(),
    [lukso.id]: http(),
  },
});
