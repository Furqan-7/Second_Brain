import { Button } from "./Button";
import Plus from "../assets/plus.svg";
import Share from "../assets/share.svg";
import { useSetRecoilState } from "recoil";
import { addContent } from "../atoms/addContentAtom";
import { ShareAtom } from "../atoms/ShareAtom";


export function ButtonComponent() {
  const setAddContent = useSetRecoilState(addContent);
  const setShareAtom = useSetRecoilState(ShareAtom);

  return (
    <div className=" flex  gap-4">
      <Button
        variant="secondary"
        size="sm"
        text="Share Brain"
        startIcon={Share}
        onClick={() => {
          setShareAtom((value) => !value);
        }}
      ></Button>

      <Button
        variant="primary"
        size="sm"
        text="Add Content"
        startIcon={Plus}
        onClick={() => {
          setAddContent((value) => !value);
        }}
      ></Button>
    </div>
  );
}
