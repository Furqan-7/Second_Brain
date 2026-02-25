import { LuBrain } from "react-icons/lu";
import type { IconType } from "react-icons";
import { FaDoorClosed, FaFile, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FiFileText, FiHash } from "react-icons/fi";
import { IoLinkSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router";

interface SideBarProps {
  Icon: IconType;
  Text: string;
  color: string;
}

export function SideBar() {
      const Navigate = useNavigate();
  return (
    <div className=" w-64 h-full  flex flex-col  shadow-xl/30  w-20  md:w-56 lg:w-72 border border-gray-300">
      <div className="flex items-center mt-5 ml-5 mr-5 gap-2">
        <LuBrain size={35} color="5146e4" />
        <p className="font-semibold text-[19px]  flex hidden md:flex block">
          Second Brain
        </p>
      </div>

      <div className="mt-10">
        <SideBarIcons Icon={FaXTwitter} Text={"Tweets"} color={"black"} />
        <SideBarIcons Icon={FaYoutube} Text={"Videos"} color={"red"} />
        <SideBarIcons Icon={FiFileText} Text={"Documents"} color={"gray"} />
        <SideBarIcons Icon={IoLinkSharp} Text={"Links"} color={"gray"} />
        <SideBarIcons Icon={FiHash} Text={"Tags"} color={"gray"} />
      </div>

      <div className="flex items-center gap-4 ml-7 mr-7  mt-auto ">
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <div className="mt-4 mb-8">
        <div onClick={()=>{
              Navigate("/");
        }} className=" flex ml-6 mr-6 rounded-[10px] gap-10 justify-center items-center h-10 bg-red-200 hover:cursor-pointer">
            <div className="text-red-500">
                  Log Out 
            </div>
           <TbLogout size={20} color="red" />
        </div>
      </div>
    </div>
  );
}

function SideBarIcons({ Icon, Text, color }: SideBarProps) {
  return (
    <div className="flex items-center ml-8 mr-8 mt-6 gap-3">
      <Icon color={color} className="md:size-5" />
      <p className="text-[#475569] text-[15px] flex hidden md:flex block  tracking-wide">
        {Text}
      </p>
    </div>
  );
}
