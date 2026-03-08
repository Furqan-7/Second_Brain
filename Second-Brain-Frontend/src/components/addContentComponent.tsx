import { useSetRecoilState } from "recoil";
import { addContent } from "../atoms/addContentAtom";
import type { KeyboardEvent } from "react";
import {
  FaAngleDown,
  FaGlobe,
  FaLinkedin,
  FaSquareInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import Xmark from "../assets/xmark.svg";
import type { IconType } from "react-icons";

import { CiFileOn } from "react-icons/ci";
import { OtherContent } from "../atoms/OtherContentAtom";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useState } from "react";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useFetchContents } from "../hooks/useContnet";
import { FiFileText } from "react-icons/fi";

// Interface for the reusable input box component
// setTitle and setContent are optional because the same component
// is used for both Title input and Content input
interface InputBox {
  Text: string;
  PlaceHolder: string;
  Height: string;
  setTitle?: (value: string) => void;
  setContent?: (value: string) => void;
}

// Interface for the Tags component
// tags = display values, tagIds = actual DB ids sent to the backend
interface TagsProps {
  tags: string[];
  setAllTags: (value: string[]) => void;
  tagIds: string[];
  setTagIds: (value: string[]) => void;
}

// Interface for each individual icon button in ContentSource
// isSelected = whether this icon is currently active (controlled by parent)
// onSelect = callback to tell parent "I was clicked"
interface Icons {
  Icon: IconType;
  IconText?: string;
  IconColor?: string;
  EndIcon?: IconType;
  isSelected?: boolean;
  onSelect?: () => void;
}

// Interface for ContentSource component
// selected and setSelected are lifted from AddContent
// so the selected type value can be used when posting to the DB
interface ContentSourceProps {
  selected: string | null;
  setSelected: (value: string | null) => void;
}

// This is Main Layout of the Add Content Component
export function AddContent() {
  const setAddContent = useSetRecoilState(addContent);
  const fetchContents = useFetchContents();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // selected is lifted here (not in ContentSource or ContentSourceIcons)
  // because handleAddContent needs it to send the correct type to the DB
  // This is the "single source of truth" for which content source is active
  const [selected, setSelected] = useState<string | null>(null);

  const [tags, setAllTags] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);

  const token = localStorage.getItem("token");

  const handleAddContent = async () => {
    try {
      const Response = await axios.post(
        "http://localhost:3000/api/v1/content",
        {
          link: content,
          type: selected, // ✅ selected is available here because state lives at this level
          title: title,
          tags: tagIds,
        },
        {
          headers: {
            token: token,
          },
        },
      );
      await fetchContents();
      setAddContent((value) => !value);
    } catch (e) {
      console.log(e);
    }
  };

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
        {/* Passing selected and setSelected down to ContentSource
            so it can highlight the active icon and update the state on click */}
        <ContentSource selected={selected} setSelected={setSelected} />
        <ContentTitle
          setContent={setContent}
          Text={"Content"}
          PlaceHolder={"Paste your content or link here..."}
          Height={"h-10"}
        />
        <Tags
          tags={tags}
          setAllTags={setAllTags}
          tagIds={tagIds}
          setTagIds={setTagIds}
        />

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
      {/* setTitle? and setContent? use optional chaining
          because only one of them is passed at a time depending on usage */}
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

// ContentSource receives selected and setSelected from AddContent (lifted state)
// It does NOT own the state — it just passes it further down to each icon
function ContentSource({ selected, setSelected }: ContentSourceProps) {
  return (
    <div className="pl-6 pr-6 pt-4">
      <p className="font-semibold text-[14px] tracking-wide">Content Source</p>
      <div className="flex gap-3">
        {/* Each icon receives:
            isSelected → checks if this icon is the currently active one (selected === "id")
            onSelect   → tells the parent to set this icon as selected */}
        <ContentSourceIcons
          Icon={FaXTwitter}
          IconText={"Xtwitter"}
          isSelected={selected === "twitter"}
          onSelect={() => setSelected("twitter")}
        />

        <ContentSourceIcons
          Icon={FaYoutube}
          IconText={"Videos"}
          IconColor="red"
          isSelected={selected === "youtube"}
          onSelect={() => setSelected("youtube")}
        />
        <ContentSourceIcons
          Icon={FaGlobe}
          IconText={"Links"}
          IconColor="purple"
          isSelected={selected === "Links"}
          onSelect={() => setSelected("Links")}
        />
        <ContentSourceIcons
          Icon={FiFileText}
          IconText={"Document"}
          IconColor="black"
          isSelected={selected == "Document"}
          onSelect={() => setSelected("Document")}
        />

        {/* This is an Other Icons Selction Where We can select Multiple Countent Source This is for the Future use Before Un Commenting this Comment the last Countent source icon  */}
        {/* <ContentSourceIcons
          Icon={CiFileOn}
          IconText={"Other"}
          IconColor="black"
          EndIcon={FaAngleDown}
        /> */}
      </div>
    </div>
  );
}

// ContentSourceIcons is now a "dumb" / controlled component
// It does NOT manage its own selected state anymore
// It only displays based on isSelected prop and calls onSelect when clicked
// This is the correct pattern — parent owns the state, child just renders and reports
function ContentSourceIcons({
  Icon,
  IconText,
  IconColor,
  EndIcon,
  isSelected,
  onSelect,
}: Icons) {
  const setOtherContent = useSetRecoilState(OtherContent);

  return (
    <div
      onClick={onSelect} // notify parent that this icon was clicked
      className={` cursor-pointer flex border  ${
        isSelected ? `bg-indigo-100` : `bg-gray-50` // highlight if this icon is selected
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

function Tags({ setAllTags, tags, tagIds, setTagIds }: TagsProps) {
  // Local state is fine here because Tags doesn't need to share
  // its input value with any sibling or parent component
  const [input, setInput] = useState("");

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && input.trim() !== "") {
      // Post the tag to DB and get back its _id
      const Response = await axios.post("http://localhost:3000/tag", {
        title: input.trim(),
      });

      // Store the DB id separately so it can be sent when adding content
      setTagIds([...tagIds, Response.data.tag._id]);

      e.preventDefault();
      // Store the display label separately for rendering the tag pills
      setAllTags([...tags, input.trim()]);
      setInput("");
    }
  };

  // Remove tag by index from both display array and ids array
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

      {/* Render each tag as a pill with a remove button */}
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
