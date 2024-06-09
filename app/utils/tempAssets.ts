import image from "@/public/tempImages/image.png"
import teher from "@/public/tempImages/tether.png"
import eth from "@/public/tempImages/eth.png"
import usdc from "@/public/tempImages/usdc.png"
import matic from "@/public/tempImages/matic.png"
import avax from "@/public/tempImages/avax.png"
import arb from "@/public/tempImages/arb.png"
import dot from "@/public/tempImages/dot.png"

const assets = [
  {
    name: "Lukso",
    ticker: "lyx",
    image: image,
    value: 10.93,
    repartition: 51,
    total: "15429.59",
    valueUsd: "168,645.41"
  },
  {
    name: "Ethereum",
    ticker: "eth",
    image: eth,
    value: 2356.93,
    repartition: 20,
    total: "60.82",
    valueUsd: "143,348.61"
  },
  {
    name: "Tether",
    ticker: "USDT",
    image: teher,
    value: 1.0,
    repartition: 11,
    total: "121,846.32",
    valueUsd: "121,846.32"
  },
  {
    name: "USDC",
    ticker: "USDC",
    image: usdc,
    value: 1.0,
    repartition: 7,
    total: "103,569.37",
    valueUsd: "103,569.37"
  },
  {
    name: "Polygon",
    ticker: "MATIC",
    image: matic,
    value: 0.9328,
    repartition: 4,
    total: "94,376.03",
    valueUsd: "88,033.96"
  },
  {
    name: "Avalanche",
    ticker: "AVAX",
    image: avax,
    value: 39.93,
    repartition: 4,
    total: "1,874.00",
    valueUsd: "74,828.87"
  },
  {
    name: "Arbitrum",
    ticker: "ARB",
    image: arb,
    value: 2.05,
    repartition: 2,
    total: "31,026.60",
    valueUsd: "63,604.54"
  },
  {
    name: "Polkadot",
    ticker: "DOT",
    image: dot,
    value: 7.93,
    repartition: 1,
    total: "6,817.64",
    valueUsd: "54,063.86"
  }
]

export default assets
