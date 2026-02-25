import "./App.css";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { addContent } from "./atoms/addContentAtom";
import { ButtonComponent } from "./components/ButtomComponent";
import { AddContent, AddOtherContent } from "./components/addContentComponent";
import { OtherContent } from "./atoms/OtherContentAtom";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { Monitor } from "lucide-react";
import { FaAngleDoubleDown } from "react-icons/fa";
import { ShareAtom } from "./atoms/ShareAtom";
import { ShareBrain } from "./components/ShareBrainComponent";
import { Card } from "./components/Card";
import { SideBar } from "./components/SideBarComponent";
import { SignupComponent } from "./components/Signup.tsx";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SigninComponent } from "./components/Signin.tsx";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignupComponent />} />
          <Route path="/Signin" element={<SigninComponent/>} />
          <Route path="/Dashboard" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

function Layout() {
  const Content = useRecoilValue(addContent);
  const Othercontent = useRecoilValue(OtherContent);
  const Share = useRecoilValue(ShareAtom);

  return (
    <div className="bg-white flex h-screen ">
      {/* Side Bar  */}
      <div>
        <SideBar />
      </div>

      <div>
        <div className="flex justify-between gap-115 ml-10 lg:ml-16 pr-24 lg:pr-36  w-full mt-9  ">
          <div className=" text-[23px] h-min font-semibold">All Notes</div>
          <div className="h-min">
            <ButtonComponent />
            {Content ? <AddContent /> : null}
            {Othercontent && Content ? <AddOtherContent /> : null}
            {Share ? <ShareBrain /> : null}
          </div>
        </div>

        <div className="flex ml-8 lg:ml-16 mt-10  flex-wrap gap-8 lg:gap-13 mb-20 ">
          {/* <Card /> */}
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}

// text-[#475569] Light Text Color

export default App;
