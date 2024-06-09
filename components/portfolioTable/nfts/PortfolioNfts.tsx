import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import image from "@/public/tempImages/image.png"
import { useGlobalContext } from "@/GlobalContext/GlobalContext"
import testNft from "@/public/images/testnft.png"

const assets = [
  {
    name: "chillwhales",
    id: 7526,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  },
  {
    name: "chillguys",
    id: 2413,
    image: testNft.src
  }
]

function PortfolioNfts() {
  const { darkTheme } = useGlobalContext()


  return (
    <div style={{ gridTemplateRows: "repeat(auto-fill, minmax(291px, 291px))" }} className="grid grid-cols-[repeat(auto-fill,minmax(211px,1fr))]
     items-center justify-between gap-[16px] py-[16px] px-[16px]">
      {assets.map((item, index) => (
        <div
          key={index}
          className={`border border-solid ${darkTheme ? "bg-neutral-700 border-neutral-500" : "bg-neutral-0 border-neutral-200"} cursor-pointer
         rounded-[8px] flex flex-col gap-[16px] p-[12px] hover:shadow-lg transform hover:translate-y-[-4px] transition duration-300 ease-in-out`}
        >
          <img src={item.image} className="w-full rounded-[8px]" />
          <span
            className={`${darkTheme ? "text-white" : "text-neutral-875"} text-large font-semibold`}
          >
            chillwhales
          </span>
          <span
            className={`${darkTheme ? "text-white" : "text-neutral-875"} text-large font-regular`}
          >
            7626
          </span>
        </div>
      ))}
    </div>
  )
}

export default PortfolioNfts
