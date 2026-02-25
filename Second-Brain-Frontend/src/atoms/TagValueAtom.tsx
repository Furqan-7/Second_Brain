import {atom} from "recoil";

export const TagValue = atom<string[]>({
      default:[],
      key:"TagValue"
})