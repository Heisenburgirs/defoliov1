import React, { useState } from "react"
import { useGlobalContext } from "@/GlobalContext/GlobalContext"

interface Props {
  text: string
  position: "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right"
  children: React.ReactNode
}

const Tooltip: React.FC<Props> = ({ text, position, children }) => {
  const { darkTheme } = useGlobalContext()

  const [isHovered, setIsHovered] = useState(false)

  const tooltipStyle: React.CSSProperties = {
    position: "absolute",
    visibility: isHovered ? "visible" : "hidden", // Control visibility based on hover
    zIndex: 1000 // Ensure tooltip appears above other content
  }

  switch (position) {
  case "top":
    tooltipStyle.top = "-30px"
    tooltipStyle.left = "50%"
    tooltipStyle.transform = "translateX(-50%)"
    break
  case "top-left":
    tooltipStyle.top = "-30px"
    tooltipStyle.left = "0"
    break
  case "top-right":
    tooltipStyle.top = "-30px"
    tooltipStyle.right = "0"
    break
  case "bottom":
    tooltipStyle.bottom = "-30px"
    tooltipStyle.left = "50%"
    tooltipStyle.transform = "translateX(-50%)"
    break
  case "bottom-left":
    tooltipStyle.bottom = "-30px"
    tooltipStyle.left = "0"
    break
  case "bottom-right":
    tooltipStyle.bottom = "-30px"
    tooltipStyle.right = "0"
    break
  default:
    break
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-block"
    >
      {children}
      <div
        style={tooltipStyle}
        className={"whitespace-nowrap max-w-[200px] flex items-center justify-center py-[4px] px-[8px] bg-background-darktheme text-neutral-0 text-small rounded-50"}
      >
        {text}
      </div>
    </div>
  )
}

export default Tooltip
