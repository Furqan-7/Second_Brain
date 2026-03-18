import { atom } from "recoil";

interface ContentItem {
  _id: string;
  link: string;
  type: "Document" | "twitter" | "Video" | "Links" | "youtube";
  title: string;
  tags: string[];
  userId: string;
  __v: number;
}

interface BrainUser {
  _id: string;
  username: string;
}

interface BrainData {
  user: BrainUser;
  content: ContentItem[];
}

export const ShareUrl = atom<BrainData | null>({
  default: null,
  key: "ShareBrainUrl ",
});
