import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { addContent } from "../atoms/addContentAtom";
import type { FormEvent, KeyboardEvent } from "react";
import {
  FaAngleDown,
  FaArrowDown,
  FaFile,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaLinkedinIn,
  FaSquareInstagram,
  FaWordpressSimple,
  FaXTwitter,
} from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import Xmark from "../assets/xmark.svg";
import type { IconType } from "react-icons";
import { FaFileExcel, FaInstagramSquare, FaSave } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { OtherContent } from "../atoms/OtherContentAtom";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useState } from "react";
import { set } from "mongoose";
import { TagValue } from "../atoms/TagValueAtom";
import { Input } from "postcss";
import axios from "axios";
import jwtDecode from "jwt-decode";

interface InputBox {
  Text: string;
  PlaceHolder: string;
  Height: string;
  setTitle?: (value: string) => void;
  setContent?: (value: string) => void;
}

interface TagsProps {
  tags: string[];
  setAllTags: (value: string[]) => void;
}

interface Icons {
  Icon: IconType;
  IconText?: string;
  IconColor?: string;
  EndIcon?: IconType;
}

// This is Main Layout of the Add Content Component
export function AddContent() {
   const setAddContent = useSetRecoilState(addContent);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setAllTags] = useState<string[]>([]);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode<{ userId: string }>(token!);
 const userId = decoded.userId;

  const handleAddContent = async()=>{
        const Response = await axios.post("http://localhost:3000/api/v1/content",{
            link:content,
            type: "document",
            title:title,
            tags:tags,
            userId:userId
        })
        console.log(Response)
        setAddContent((value) => !value);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="bg-white shadow-xl/30 w-[435px] h-auto rounded-lg ">
        <XmarkButton />
        <ContentTitle
          setTitle={setTitle}
          Text={"Title"}
          PlaceHolder={"Enter a title..."}
          Height={"h-9"}
        />
        <ContentSource />
        <ContentTitle
          setContent={setContent}
          Text={"Content"}
          PlaceHolder={"Paste your content or link here..."}
          Height={"h-10"}
        />
        <Tags tags={tags} setAllTags={setAllTags} />
            
        {/* Add Content Button  */}
        <div>
          <button
           onClick={handleAddContent}
            className="w-sm h-9 bg-[#505bd0] text-white text-[14px] hover:cursor-pointer font-semibold ml-6 rounded-[8px] mt-4 mb-6 "
          >
            Add Content
          </button>
        </div>
      </div>
    </div>
  );
}

function XmarkButton() {
  const setAddContent = useSetRecoilState(addContent);
  return (
    <div className="flex justify-between items-center pt-6 pl-6 pr-6">
      <p className="font-semibold text-[19px]">Add Content</p>
      <button
        onClick={() => {
          setAddContent((value) => !value);
        }}
      >
        <img
          className="hover:cursor-pointer"
          src={Xmark}
          alt="Xmark"
          width={20}
        ></img>
      </button>
    </div>
  );
}

function ContentTitle({
  Text,
  PlaceHolder,
  Height,
  setTitle,
  setContent,
}: InputBox) {
  return (
    <div className="pl-6 pr-6 pt-4">
      <p className="font-semibold text-[14px] tracking-wide">{Text}</p>
      <input
        onChange={(e) => {
          setTitle?.(e.target.value);
          setContent?.(e.target.value);
        }}
        className={`shadow-sm  w-sm ${Height}   border border-gray-200 pl-4 text-[13px] mt-2  rounded-[10px]`}
        type="text"
        placeholder={PlaceHolder}
      ></input>
    </div>
  );
}

function ContentSource() {
  return (
    <div className="pl-6 pr-6 pt-4">
      <p className="font-semibold text-[14px] tracking-wide">Content Source</p>
      <div className="flex gap-3">
        <ContentSourceIcons Icon={FaXTwitter} IconText={"Xtwitter"} />
        <ContentSourceIcons
          Icon={FaYoutube}
          IconText={"Videos"}
          IconColor="red"
        />
        <ContentSourceIcons
          Icon={FaGlobe}
          IconText={"Links"}
          IconColor="purple"
        />
        <ContentSourceIcons
          Icon={CiFileOn}
          IconText={"Other"}
          IconColor="black"
          EndIcon={FaAngleDown}
        />
      </div>
    </div>
  );
}

// We have to make the chnages here for the other Icons Selecting
function ContentSourceIcons({ Icon, IconText, IconColor, EndIcon }: Icons) {
  const [changeBg, setChangeBg] = useState(false);
  const setOtherContent = useSetRecoilState(OtherContent);

  return (
    <div
      onClick={() => {
        setChangeBg((value) => !value);
      }}
      className={` cursor-pointer flex border  ${
        changeBg ? `bg-indigo-100` : `bg-gray-50`
      } bg-gray-50 justify-center inset-shadow-xl/30 items-center gap-2 border-gray-400 w-22 mt-2 h-9 rounded-[7px]`}
    >
      <Icon color={IconColor} size={18} />
      {<p className="font-semibold text-[10.5px] tracking-wide">{IconText}</p>}
      <button
        onClick={() => {
          setOtherContent((value) => !value);
        }}
      >
        {EndIcon && <EndIcon size={10} className="hover:cursor-pointer" />}
      </button>
    </div>
  );
}

export function AddOtherContent() {
  const setOtherContent = useSetRecoilState(OtherContent);
  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className=" bg-white shadow-xl/30 w-[300px] h-auto rounded-lg">
        <div className="flex justify-between pt-4 font-semibold pl-4 pr-4">
          <p>Other</p>
          <button
            onClick={() => {
              setOtherContent((value) => !value);
            }}
          >
            <img src={Xmark} alt="Xmark" width={20}></img>
          </button>
        </div>

        <div className="inset-shadow-xl/30 border m-4 border  border-gray-400 bg-gray-50 rounded-[8px]">
          <div className="  inset-shadow-xl/30 flex gap-2 justify-start p-2 border-b border-gray-400 ">
            <HiOutlineDocumentText
              className="rounded-[10px]"
              size={20}
              color="blue"
            />
            <p className="text-[13px] tracking-wide ">Document</p>
          </div>

          <div className=" inset-shadow-xl/30 flex gap-2 justify-start p-2 border-b border-gray-400 ">
            <FaSquareInstagram
              className="rounded-[10px]"
              size={20}
              color="#E4405F"
            />
            <p className="text-[13px] tracking-wide ">Instagram</p>
          </div>

          <div className=" inset-shadow-xl/30 flex gap-2 justify-start p-2 border-b border-gray-400 ">
            <FaLinkedin className="rounded-[8px]" size={20} color="blue" />
            <p className="text-[13px] tracking-wide ">Linkedin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tags({ setAllTags, tags }: TagsProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && input.trim() !== "") {
      e.preventDefault();
      setAllTags([...tags, input.trim()]);
      setInput("");
    }
  };

  const RemoveTag = (index: number) => {
    const updated = [...tags];
    updated.splice(index, 1);
    setAllTags(updated);
  };

  return (
    <div className="pl-6 pr-6 pt-4">
      <p className="font-semibold text-[14px] tracking-wide">Tags</p>
      <input
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`shadow-sm w-sm h-9   border border-gray-200 pl-4 text-[13px] mt-2  rounded-[10px]`}
        type="text"
        placeholder="Add a tag..."
      ></input>

      <div className="inset-shadow-xl/30 mt-2  rounded-[8px] flex flex-wrap justify-start gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="pl-2 pr-2 border border-gray-400  bg-gray-100 rounded-[5px] text-[12px]"
          >
            {"#" + tag}
            <button onClick={() => RemoveTag(index)}>
              {
                <img
                  className="flex justify-center items-center ml-2 hover:cursor-pointer"
                  src={Xmark}
                  alt="Xmark"
                  width={14}
                ></img>
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// function AddContentButton() {

//   return (
//     <div>
//       <button
//         onClick={() => setAddContent((value) => !value)}
//         className="w-sm h-9 bg-[#505bd0] text-white text-[14px] hover:cursor-pointer font-semibold ml-6 rounded-[8px] mt-4 mb-6 "
//       >
//         Add Content
//       </button>
//     </div>
//   );
// }
