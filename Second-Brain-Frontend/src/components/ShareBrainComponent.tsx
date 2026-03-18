import { useRecoilState, useSetRecoilState } from "recoil";
import Xmark from "../assets/xmark.svg";
import { ShareAtom } from "../atoms/ShareAtom";
import { useEffect, useState } from "react";
import { Hash } from "lucide-react";
import axios from "axios";
import { ShareHash } from "../atoms/ShareHash";
import { ShareUrl } from "../atoms/ShareUrl";

export function ShareBrain() {
  const [ShareValue, setShareAtom] = useRecoilState(ShareAtom);
  const [link, setLink] = useState(false);
  const [hash, setHash] = useRecoilState(ShareHash);
  const token = localStorage.getItem("token");

  const data = `http://localhost:5173/share/${hash}`;
  const handleShare = async () => {
    const Response = await axios.post(
      "http://localhost:3000/api/v1/brain/share",
      { Share: true },
      {
        headers: { token: token },
      },
    );
    console.log(Response.data.hash);
    setHash(Response.data.hash.hash);

    setLink((value) => !value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="bg-white shadow-xl/30 w-[330px] h-auto rounded-lg ">
        <div className="flex justify-between pl-4 pr-4 pt-4 ">
          <p className="font-semibold text-[15px]">Share Your Second Brain</p>
          <img
            className="hover:cursor-pointer"
            onClick={() => {
              setShareAtom((value) => !value);
            }}
            src={Xmark}
            alt="Xmark"
            width={18}
          ></img>
        </div>

        <div className=" pl-4 pr-8 pt-4 ">
          <p className="text-[12.5px] text-[#475569]">
            Share your entire collection of notes, documents, tweets, and videos
            with others. They'll be able to import your content into their own
            Second Brain.
          </p>
        </div>

        {link ? <ShareLink hash={data} /> : null}

        <div>
          <button
            onClick={handleShare}
            className="w-[290px] h-9 bg-[#505bd0] text-white text-[14px] hover:cursor-pointer font-medium ml-4 rounded-[8px] mt-4 mb-6 "
          >
            {link ? "Got it" : "Share Brain"}
          </button>
        </div>
      </div>
    </div>
  );
}

type ShareLinkProps = {
  hash: string;
};

function ShareLink({ hash }: ShareLinkProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      alert("Copied!");
    } catch (e) {
      alert("Failed to Copy");
    }
  };

  return (
    <div className="flex justify-between items-center gap-1">
      <div className="    justify-between truncate  p-1.5 items-center w-[210px] rounded-[8px] ml-4  mt-4 h-auto border border-gray-400 bg-gray-200">
        <article className="text-wrap">
          <p className="text-wrap">{hash}</p>
        </article>
      </div>

      <button
        onClick={handleCopy}
        className="bg-[#505bd0] mt-3 w-16 h-9 mr-7 hover:cursor-pointer text-white text-[11px] p- rounded-[5px]"
      >
        Copy Link
      </button>
    </div>
  );
}
