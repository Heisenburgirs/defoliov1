"use client"

import Link from "next/link"
import landingImage from "@/public/images/landingImage.png"
import landingImage2 from "@/public/images/landingImage_2.png"
import landingImage3 from "@/public/images/landingImage_3.png"
import minus from "@/public/images/minus.png"
import plus from "@/public/images/plus.png"
import { useState } from "react"

export default function Landing() {
  const [faq, setFaq] = useState([
    {
      title: "What is Defolio and who is it for?",
      text: "DeFolio is a decentralized application for managing digital assets on the Lukso network, aimed at users with a Universal Profile seeking a streamlined asset management experience.",
      expanded: false
    },
    {
      title: "How can I view my assets in DeFolio?",
      text: "Users can view their LSP7/LSP8 assets and LYX balance on DeFolio, which offers a comprehensive overview of their portfolio and its value in various currencies.",
      expanded: false
    },
    {
      title: "How does DeFolio ensure transaction security?",
      text: "DeFolio enables secure transfers of LSP7/LSP8 and LYX tokens to any recipient, using a safetransfer feature to ensure the safety of transactions.",
      expanded: false
    },
    {
      title: "What is the Keymanager and how do I use it?",
      text: "The Keymanager feature lets you decide what third-party wallets can and cant do with your Universal Profile, ensuring you are in control of your digital asset security.",
      expanded: false
    },
    {
      title: "Why should I use DeFolio instead of other platforms?",
      text: "DeFolio is tailored for the Lukso ecosystem, offering a user-friendly interface and enhanced security features, making it ideal for Universal Profile users.",
      expanded: false
    },
    {
      title: "Are there any features currently not available in DeFolio?",
      text: "Currently, DeFolio focuses on portfolio tracking, asset management, and keymanager functionality, with vaults & other features planned for future updates.",
      expanded: false
    }
  ])

  const toggleHeight = (index: number) => {
    const updatedFaq = faq.map((item, i) => ({
      ...item,
      expanded: i === index ? !item.expanded : false
    }))
    setFaq(updatedFaq)
  }

  return (
    <div className="flex flex-col w-full p-0 py-[20px] m-0 gap-[30px] lg:gap-[65px] items-center pb-[36px]">
      {/* header row */}
      <div className="flex justify-between px-[32px] pt-[24px] w-full max-w-[1700px]">
        <div className="flex items-center">
          <span className="font-extrabold tracking-[3px] text-darkBlue">DEFOLIO</span>
          <div className="text-[12px] text-pink h-full justify-start items-start">Beta</div>
        </div>
        <Link href="/portfolio">
          {" "}
          <span className="w-[145px] rounded-[10px] bg-pink h-[45px] cursor-pointer text-white flex justify-center items-center font-bold text-[14px] scale-95 hover:scale-100 transition ease">
            Open Dapp →
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-[15px] lg:gap-[25px] max-w-[2564px] px-[26px]">
        <div className="flex justify-center items-center text-center">
          <div className="flex flex-col w-full justify-center items-center gap-[12px]">
            <span className="text-[#52525B] text-[18px]">All in one</span>
            <span
              style={{ fontSize: "clamp(22px, 5vw, 52px)", lineHeight: "60px" }}
              className="font-extrabold max-w-[420px] text-[#1A3042]"
            >
              Universal Profile Management
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center text-center p-[12px] gap-8">
          <span className="max-w-[290px] text-[#71717A]">
            Portfolio&nbsp; &nbsp; &nbsp;◦&nbsp; &nbsp; &nbsp;Assets&nbsp; &nbsp; &nbsp;◦&nbsp;
            &nbsp; &nbsp;Key Manager
          </span>
          <img
            src={landingImage.src}
            className="max-w-unset lg:max-w-[1000px] rounded-5 shadow-2xl"
          ></img>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-col gap-[8px] max-w-[2564px] text-center justify-center items-center py-[25px] px-[26px]">
          <span
            className="max-w-[627px] text-[#1A3042] font-extrabold"
            style={{ fontSize: "clamp(22px, 5vw, 64px)", lineHeight: "82px" }}
          >
            Universal Profile Empowerment
          </span>
          <span
            className="max-w-[533px] text-[#1A3042]"
            style={{ fontSize: "clamp(16px, 5vw, 20px", lineHeight: "26px" }}
          >
            We believe that UP is more than just a wallet. It is a tool that empowers users to
            manage their digital identity and assets in a secure and decentralized way.
          </span>
        </div>
        <div className="flex justify-center items-start text-center xl:text-left flex-col xl:flex-row gap-8 px-[26px] max-w-[1700px] py-[32px]">
          <div className="flex-[1] xl:flex-[0.5] flex justify-center items-center">
            <img src={landingImage2.src} className="h-[400px] xl:h-[820px] rounded-[30px]"></img>
          </div>
          <div className="flex w-full xl:w-unset flex-col gap-[32px] justify-center items-center xl:items-start h-[820px] flex-[1] xl:flex-[0.5]">
            <span
              className="text-[#1A3042] max-w-[716px] font-extrabold leading-[30px] md:leading-[62px]"
              style={{ fontSize: "clamp(22px, 5vw, 64px)" }}
            >
              Portfolio And Assets
            </span>
            <span className="text-[#333333] max-w-[716px]">
              Efficiently manage your portfolio and LSP7 and LSP8 assets with Defolio. Gain accurate
              insights into your digital assets through a streamlined and secure interface.
            </span>
            <Link href="/portfolio">
              <div className="h-[60px] w-[170px] rounded-10 border border-darkBlue text-darkBlue hover:border-pink hover:bg-pink hover:text-white transition flex justify-center items-center font-bold">
                Open Dapp
              </div>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-start text-center xl:text-left flex-col xl:flex-row gap-8 px-[26px] max-w-[1700px] py-[32px]">
          <div className="flex w-full xl:w-unset flex-col gap-[32px] justify-center items-center xl:items-start h-[820px] flex-[1] xl:flex-[0.5]">
            <span
              className="text-[#1A3042] max-w-[716px] font-extrabold leading-[30px] md:leading-[62px]"
              style={{ fontSize: "clamp(22px, 5vw, 64px)" }}
            >
              Configure Keymanager
            </span>
            <span className="text-[#333333] max-w-[716px]">
              Easily view what controllers have which of the 23 permissions on your Universal
              Profile. Manage existing controllers and add new ones with ease!
            </span>
            <Link href="/portfolio">
              <div className="h-[60px] w-[170px] rounded-15 border border-darkBlue text-darkBlue hover:border-pink hover:bg-pink hover:text-white transition flex justify-center items-center font-bold">
                Open Dapp
              </div>
            </Link>
          </div>
          <div className="flex-[1] xl:flex-[0.5] flex justify-center items-center">
            <img src={landingImage3.src} className="h-[400px] xl:h-[820px] rounded-[30px]"></img>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-start text-center xl:text-left flex-col xl:flex-row gap-8 px-[26px] max-w-[1700px] py-[32px]">
        <div className="flex w-full xl:w-unset flex-col gap-[32px] justify-center items-center xl:items-start h-[820px] flex-[1] xl:flex-[0.5]">
          <span
            className="text-[#1A3042] max-w-[716px] font-extrabold leading-[30px] md:leading-[62px]"
            style={{ fontSize: "clamp(22px, 5vw, 64px)" }}
          >
            Frequently Asked Questions
          </span>
          <span className="text-[#333333] max-w-[716px]">
            Do you've a more specific question? Feel free to reach out on X or Common Ground!
          </span>
          <div className="flex gap-4">
            <a
              href="https://twitter.com/defolio42"
              target="_blank"
              className="py-2 px-4 border border-pink rounded-10 hover:bg-pink transition text-pink font-bold hover:text-white" rel="noreferrer"
            >
              X
            </a>
            <a
              href="https://app.cg/c/JErL2vNVPh/"
              target="_blank"
              className="py-2 px-4 border border-pink rounded-10  hover:bg-pink transition text-pink font-bold hover:text-white" rel="noreferrer"
            >
              Common Ground
            </a>
          </div>
        </div>
        <div className="flex-[1] gap-[15px] xl:flex-[0.5] w-full xl:w-unset flex justify-center items-center flex-col h-[820px]">
          {faq.map((item, index) => {
            return (
              <div
                key={index}
                className={`bg-[#F8FAFB] gap-[12px] py-[8px] lg:gap-[26px] ${
                  item.expanded ? "justify-start" : "justify-center"
                } items-start text-left border border-solid border-[#E4E4E7] w-full xl:w-[845px] ${
                  item.expanded ? "h-[150px]" : "h-[65px]"
                } rounded-[10px] cursor-pointer overflow-hidden flex flex-col transition-all ease-in-out duration-500`}
                onClick={() => toggleHeight(index)}
              >
                <div className="w-full justify-between items-center flex px-[15px] lg:px-[30px]">
                  <span className="font-bold text-[16px] lg:text-[21px] text-[#1A3042]">
                    {item.title}
                  </span>
                  <img
                    src={item.expanded ? minus.src : plus.src}
                    width="19"
                    className="cursor-pointer"
                  />
                </div>
                {item.expanded && (
                  <span
                    className="animate-reveal text-[18px] text-darkBlue w-unset w-full
                  px-4 md:px-8 transition-all ease-in-out duration-500"
                    style={{
                      opacity: item.expanded ? 1 : 0,
                      maxHeight: item.expanded ? "1000px" : "0"
                    }}
                  >
                    {item.text}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col gap-[24px] max-w-[2564px] text-center justify-center items-center px-[26px]">
        <span
          className="max-w-[1358px] text-darkBlue font-bold leading-[64px] lg:leading-[161px]"
          style={{ fontSize: "clamp(44px, 5vw, 128px)" }}
        >
          Start Managing Your UP
        </span>
        <span
          className="max-w-[682px] text-darkBlue"
          style={{ fontSize: "clamp(16px, 5vw, 20px", lineHeight: "26px" }}
        >
          Start using DeFolio to manage your UP in novel ways - tracking your portfolio, managing
          your assets, and more.
        </span>
        <Link href="/portfolio">
          <div className="h-[60px] w-[170px] rounded-10 bg-pink flex justify-center items-center text-white font-bold">
            Get Started
          </div>
        </Link>
      </div>
      <div className="flex sm:flex-col sm:gap-8 md:gap-0 md:flex-row justify-between items-center px-[32px] w-full max-w-[1700px] flex-wrap">
        <div className="flex">
          <span className="font-extrabold tracking-[3px]">DEFOLIO</span>
        </div>
        <div className="flex gap-4">
          <a
            href="https://twitter.com/defolio42"
            target="_blank"
            className="py-2 px-4 text-darkBlue text-xsmall transition hover:text-pink" rel="noreferrer"
          >
            Follow us on X
          </a>
          <a
            href="https://app.cg/c/JErL2vNVPh/"
            target="_blank"
            className="py-2 px-4 text-darkBlue text-xsmall transition hover:text-pink" rel="noreferrer"
          >
            Join Our Common Ground
          </a>
        </div>
      </div>
    </div>
  )
}
