import { useState } from "react"

const TokenType: React.FC<TokenTypeProps> = ({ tokenType, setTokenType }) => {
  return (
    <div className="flex gap-2 items-center md:justify-center border border-darkBlue border-opacity-25 rounded-20 p-[2px]">
      <div
        onClick={() => setTokenType("LSP7")}
        className={`sm:w-1/2 text-center text-xsmall text-darkBlue rounded-20 px-4 py-2 hover:cursor-pointer ${tokenType === "LSP7" ? "bg-pink text-white" : "hover:bg-lightPink hover:bg-opacity-50"} transition`}
      >
        Tokens
      </div>
      <div
        onClick={() => setTokenType("LSP8")}
        className={`sm:w-1/2 text-center text-xsmall text-darkBlue rounded-20 px-6 py-2 hover:cursor-pointer ${tokenType === "LSP8" ? "bg-pink text-white" : "hover:bg-lightPink hover:bg-opacity-50"} transition`}
      >
        NFTs
      </div>
    </div>
  )
}

export default TokenType
