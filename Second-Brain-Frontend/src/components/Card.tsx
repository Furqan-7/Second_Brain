import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineDocumentText } from "react-icons/hi";
import { GrShareOption } from "react-icons/gr";
import { useRef, useState, type ReactNode } from "react";

interface CardProps {
  startIcon: React.ReactNode;
  Title: string;
  ShareIcon: React.ReactNode;
  DeleteIcon: React.ReactNode;
  Content: string;
  Tags: string[];
  Date: string;
}

export const Card = () => {
  const date :Date = new Date();
  return (
    <div className=" shadow-2xl w-60 h-auto border border-gray-200 rounded-lg ">
      {/* First Section  */}
      <div className="flex justify-between pt-4 pl-4 pr-4">
        <div className="flex items-center gap-2">
          <HiOutlineDocumentText color="gray" size={25} />
          <p className="font-[550] text-[15px]">Project Ideas </p>
        </div>

        <div className="flex items-center gap-2">
          <GrShareOption color="gray" size={17} />
          <RiDeleteBin6Line color="gray" size={17} />
        </div>
      </div>

      {/* Content Section  */}

      <div className="pt-4 pl-4 pr-5">
        <p className="text-[#475569] text-[14px]">
          {" "}
          Future Projects · Build a personal knowledge base · Create a habit
          tracker · Design a minimalist todo app{" "}
        </p>
      </div>



           {/* Tags Section */}
      <div className="flex flex-wrap items-center pt-4 pl-4 pr-5 gap-2">

        <div className="pl-2 pr-2 border bg-[#e0e7ff]  tracking-wide  text-[#4f47ba] border-gray-400  bg-gray-100 rounded-[10px] text-[12px]">
          <p>   {"#" + "Productivity"}</p>
        </div>
        <div className="pl-2 pr-2 border bg-[#e0e7ff]  tracking-wide  text-[#4f47ba] border-gray-400  bg-gray-100 rounded-[10px] text-[12px]">
          <p>   {"#" + "idea"}</p>
        </div>
        <div className="pl-2 pr-2 border bg-[#e0e7ff]  tracking-wide  text-[#4f47ba] border-gray-400  bg-gray-100 rounded-[10px] text-[12px]">
          <p>   {"#" + "Productivity"}</p>
        </div>

      </div>



      {/* Date Section  */}

      <div className="p-4">
         <p className=" text-[#475569] text-[12px]">{"Added on "+date.toLocaleDateString()}</p>
      </div>



    </div>
  );
};

// #101827
