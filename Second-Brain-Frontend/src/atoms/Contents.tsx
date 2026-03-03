import { atom } from "recoil";

interface Tag {
  _id: string;
  title: string;
}

interface Content {
  _id: string;
  link?: string;
  title: string;
  type: string;
  tags: Tag[];
  userId: string;
}

export const contentAtom = atom<Content[]>({
  key: "ContentsAtom",
  default: [],
});
