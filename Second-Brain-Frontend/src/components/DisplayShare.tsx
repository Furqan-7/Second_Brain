import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router";
import { useRecoilState } from "recoil";
import { ShareUrl } from "../atoms/ShareUrl";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FiFileText } from "react-icons/fi";
import { IoLinkSharp } from "react-icons/io5";
import { GrShareOption } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";

export function DisplayShare() {
  const { shareId } = useParams();
  const [brainData, setBrainData] = useRecoilState(ShareUrl);

  useEffect(() => {
    if (!shareId) return;
    axios
      .get(`http://localhost:3000/api/v1/brain/${shareId}`) // backend
      .then((res) => setBrainData(res.data))
      .catch((err) => console.error(err));
  }, [shareId]);

  if (!brainData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-10">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-lg">
          {brainData.user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-lg font-medium">
            {brainData.user.username}'s Brain
          </h1>
          <p className="text-sm text-gray-500">
            {brainData.content.length} items saved
          </p>
        </div>
      </div>

      <div className="flex grid grid-cols-3 ml-16 ">
        {brainData.content.map((content, index) => (
          <div className="shadow-sm h-auto mt-10 w-60 rounded-2xl" key={index}>
            <div>
              <div className="flex gap-4 ml-4 mt-4 ">
                {content.type == "twitter" ? (
                  <FaXTwitter color="black" size={19} />
                ) : null}
                {content.type == "youtube" ? (
                  <FaYoutube color="red" size={21} />
                ) : null}
                {content.type == "Links" ? (
                  <IoLinkSharp color="black" size={22} />
                ) : null}
                {content.type == "Document" ? (
                  <FiFileText color="black" size={20} />
                ) : null}

                {content.title}
              </div>
            </div>

            <div className="ml-4 mr-4 mt-2 mb-4">{content.link}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
