import { useSetRecoilState } from "recoil";
import { contentAtom } from "../atoms/Contents";
import axios from "axios";

export const useFetchContents = () => {
  const setContents = useSetRecoilState(contentAtom);

  const  fetchContents = async () => {
    const token = localStorage.getItem("token");
    const  data  = await axios.get("http://localhost:3000/api/v1/content", {
      headers: {
        token: token,
      },
    });
    setContents(data.data.content);
  };

  return  fetchContents;
};
