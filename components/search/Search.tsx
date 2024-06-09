import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import image from "@/public/tempImages/image.png"
import smallChartImg from "@/public/images/smallChart.png"
import smallChartWhiteImg from "@/public/images/smallChartWhite.png"
import { useGlobalContext } from "@/GlobalContext/GlobalContext"
function Dropdown() {
  const { setDarkTheme, darkTheme } = useGlobalContext()

  return (
    <input
      type="search"
      className={`text-small appearance-none border-none max-w-[100px] ${darkTheme ? "bg-background-darktheme" : ""}
       outline-none focus:outline-none ${darkTheme ? "text-neutral-250" : "text-neutral-500"}`}
      placeholder="Search an asset..."
    />
  )
}

export default Dropdown
