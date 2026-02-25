import { FaGithub, FaGoogle } from "react-icons/fa6";
import { LuBrain } from "react-icons/lu";
import Google from "../assets/google.png";
import { useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";

export function SignupComponent() {
  return (
    <div>
      <div className="flex justify-center items-center mt-10">
        <div className="shadow-xl/30 border  border-gray-200 w-[400px]  rounded-2xl h-auto">
          <Logo />
          <Signup />
        </div>
      </div>
    </div>
  );
}

function Signup() {
  const Navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  

const handleCreateAccount = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/signup",
      {
        username,
        password,
      }
    );

    if (response.data.valid) {
      Navigate("/Dashboard");
    } else {
      alert("Incorrect Format");
    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

  const handleSignin = () => {
    Navigate("/Signin");
  };

  return (
    <div className="shadow-xl/30 w-[370px]  h-auto ml-3.5 mt-4 rounded-2xl border border-gray-200 mb-10 ">
      <div className="flex justify-center items-center mt-4">
        <p className="font-semibold text-[23px]">Sign Up</p>
      </div>

      <div className="flex justify-center items-center mt-2">
        <input onChange={(e)=>{
            setUsername(e.target.value);
        }}
          className={`shadow-sm w-80 h-9 tracking-wider font-medium   border border-gray-200 pl-4 text-[13px] mt-2  rounded-[10px]`}
          type="text"
          placeholder="Username"
        ></input>
      </div>

      <div className="flex justify-center items-center mt-2">
        <input onChange={(e)=>{
          setPassword(e.target.value);
        }}
          className={`shadow-sm w-80 h-9 tracking-wider font-medium  border border-gray-200 pl-4 text-[13px] mt-2  rounded-[10px]`}
          type="password"
          placeholder="Password"
        ></input>
      </div>

      <div>
        <button
          onClick={handleCreateAccount}
          className="w-80 hover:cursor-pointer h-9 shadow-sm bg-[#505bd0] text-white text-[14px] hover:cursor-pointer font-medium ml-6 rounded-[8px] mt-4 mb-4 "
        >
          Create account
        </button>
      </div>

      <ContinueWith />
      <GoogleSignup />
      <GitHubSignup />

      <div className="flex justify-center items-center mt-4 mb-6">
        <p>
          Already have an account?{" "}
          <button
            onClick={handleSignin}
            className="text-[#6b60c6] hover:cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

function ContinueWith() {
  return (
    <div className="flex items-center gap-4 ml-7 mr-7">
      <div className="flex-1 h-px bg-gray-300"></div>
      <span className="text-sm text-gray-500">Or continue with</span>
      <div className="flex-1 h-px bg-gray-300"></div>
    </div>
  );
}

function GoogleSignup() {
  return (
    <div className="flex justify-center items-center mt-4 hover:cursor-pointer">
      <div className="w-80 h-9 gap-1 shadow-sm rounded-[10px]  border border-gray-200 flex items-center justify-center">
        <img src={Google} width={35} />
        <p>Sign up with Google</p>
      </div>
    </div>
  );
}

function GitHubSignup() {
  return (
    <div className="flex justify-center items-center mt-4 hover:cursor-pointer">
      <div className="w-80 h-9 gap-2 shadow-sm rounded-[10px] bg-[#2b2f4c]  border border-gray-200 flex items-center justify-center">
        <FaGithub size={25} color="white" />
        <p className="text-white">Sign up with GitHub</p>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex justify-center items-center gap-2 mt-5">
      <LuBrain size={42} color="5146e4" />
      <p className="font-semibold text-[22px]">Second Brain</p>
    </div>
  );
}
