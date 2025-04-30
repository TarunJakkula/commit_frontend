"use client";

import { setUser } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { CheckMark } from "@/ui/icons";
import axiosInstance from "@/utils/axiosInstance";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

type FormData = {
  f_name: string;
  l_name: string;
  email: string;
  password: string;
};

const DEFAULT_OPTIONS: FormData = {
  f_name: "",
  l_name: "",
  email: "",
  password: "",
};

enum FormState {
  f_name = "First Name",
  l_name = "Last Name",
  email = "Email",
  password = "Password",
}

enum FormDesc {
  f_name = "Enter your first name.",
  l_name = "Enter your last name.",
  email = "Enter a correct email id.",
  password = "Set a password of min. length 6.",
}

type Response = {
  data: {
    token: string;
    uid: string;
    email: string;
  };
  message: string;
};

export default function Signup() {
  const [stages, setStages] = useState<FormData>(DEFAULT_OPTIONS);
  const [activeStage, setActiveStage] = useState<keyof FormData>("f_name");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const [formValid, setFormValid] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post<Response>(
        "/auth/register",
        stages
      );
      setLoading(false);
      setStages(DEFAULT_OPTIONS);
      setActiveStage("f_name");
      toast.success(data.message);
      const { email, uid, token } = data.data;
      dispatch(setUser({ email, uid }));
      document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24}`;
      router.replace("/home");
    } catch (e: any) {
      setLoading(false);
      toast.error(e?.response?.data?.error || "Error signing up");
    }
  };

  const handleStateChange =
    (stage: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) =>
      setStages((state) => ({
        ...state,
        [stage]: e.target.value,
      }));

  const handleNext = (activeStage: keyof FormData) => () => {
    let isValid = false;
    switch (activeStage) {
      case "f_name":
        isValid = firstNameRef.current?.checkValidity() ?? false;
        if (!isValid) {
          firstNameRef.current?.reportValidity();
          return;
        }
        setActiveStage("l_name");
        break;
      case "l_name":
        isValid = lastNameRef.current?.checkValidity() ?? false;
        if (!isValid) {
          lastNameRef.current?.reportValidity();
          return;
        }
        setActiveStage("email");
        break;
      case "email":
        isValid = emailRef.current?.checkValidity() ?? false;
        if (!isValid) {
          emailRef.current?.reportValidity();
          return;
        }
        setActiveStage("password");
        break;
      case "password":
        isValid = passwordRef.current?.checkValidity() ?? false;
        if (!isValid) {
          passwordRef.current?.reportValidity();
          return;
        }
        setActiveStage("password");
        break;
      default:
        break;
    }
  };

  const handlePrev = (activeStage: keyof FormData) => () => {
    let isValid = false;
    switch (activeStage) {
      case "f_name":
        isValid = firstNameRef.current?.checkValidity() ?? false;
        if (!isValid) {
          firstNameRef.current?.reportValidity();
          return;
        }
        setActiveStage("f_name");
        break;
      case "l_name":
        isValid = lastNameRef.current?.checkValidity() ?? false;
        if (!isValid) {
          lastNameRef.current?.reportValidity();
          return;
        }
        setActiveStage("f_name");
        break;
      case "email":
        isValid = emailRef.current?.checkValidity() ?? false;
        if (!isValid) {
          emailRef.current?.reportValidity();
          return;
        }
        setActiveStage("l_name");
        break;
      case "password":
        isValid = passwordRef.current?.checkValidity() ?? false;
        if (!isValid) {
          passwordRef.current?.reportValidity();
          return;
        }
        setActiveStage("email");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const emailValid = emailRef.current?.checkValidity() ?? false;
    const passwordValid = passwordRef.current?.checkValidity() ?? false;
    const firstNameValid = firstNameRef.current?.checkValidity() ?? false;
    const lastNameValid = lastNameRef.current?.checkValidity() ?? false;
    setFormValid(
      emailValid && passwordValid && firstNameValid && lastNameValid
    );
  }, [stages]);

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex items-end justify-between w-full gap-10"
    >
      <div className="flex flex-col justify-center items-end gap-5 flex-1">
        <div className="flex justify-between items-center gap-5 w-full">
          <span className="text-[var(--primary)] font-medium tracking-tighter text-sm w-fit select-none mr-5">
            {FormDesc[activeStage]}
          </span>
          <span className="text-white font-medium tracking-tighter text-nowrap text-md bg-[var(--accent)] w-fit px-6 py-2 rounded-full shadow-2xl transition-all select-none mr-4">
            {FormState[activeStage]}
          </span>
        </div>
        <input
          type="text"
          id={FormState.f_name}
          required
          ref={firstNameRef}
          value={stages.f_name}
          onChange={handleStateChange("f_name")}
          placeholder="Tarun"
          autoFocus
          disabled={loading}
          className={`focus:shadow-2xl bg-black/10 focus:text-black text-white/80 focus:bg-white  placeholder:text-black/40 transition-all focus:outline-none tracking-tighter w-full rounded-full px-6 py-4 ${
            activeStage !== "f_name" && "hidden"
          }`}
        />
        <input
          type="text"
          id={FormState.l_name}
          required
          ref={lastNameRef}
          value={stages.l_name}
          onChange={handleStateChange("l_name")}
          placeholder="Jakkula"
          autoFocus
          disabled={loading}
          className={`focus:shadow-2xl bg-black/10 focus:text-black text-white/80 focus:bg-white focus:placeholder:text-black/40 transition-all focus:outline-none tracking-tighter w-full rounded-full px-6 py-4 ${
            activeStage !== "l_name" && "hidden"
          }`}
        />
        <input
          type="email"
          id={FormState.email}
          required
          ref={emailRef}
          value={stages.email}
          onChange={handleStateChange("email")}
          placeholder="tarunjakkula1236@gmail.com"
          autoFocus
          disabled={loading}
          className={`focus:shadow-2xl bg-black/10 focus:text-black text-white/80 focus:bg-white focus:placeholder:text-black/40 transition-all focus:outline-none tracking-tighter w-full rounded-full px-6 py-4 ${
            activeStage !== "email" && "hidden"
          }`}
        />
        <input
          type="password"
          id={FormState.password}
          required
          ref={passwordRef}
          minLength={6}
          value={stages.password}
          onChange={handleStateChange("password")}
          placeholder="Sample@123"
          autoFocus
          disabled={loading}
          className={`focus:shadow-2xl bg-black/10 focus:text-black text-white/80 focus:bg-white focus:placeholder:text-black/40 transition-all focus:outline-none tracking-tighter w-full rounded-full px-6 py-4 ${
            activeStage !== "password" && "hidden"
          }`}
        />
        <div className="flex justify-between items-center gap-5 w-full">
          <button
            type="button"
            disabled={activeStage === "f_name" || loading}
            onClick={handlePrev(activeStage)}
            className="text-white disabled:text-neutral-700 font-medium tracking-tighter disabled:cursor-default cursor-pointer text-md w-fit p-2 rounded-full shadow-2xl transition-all select-none"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            disabled={activeStage === "password" || loading}
            onClick={handleNext(activeStage)}
            className="text-white disabled:text-neutral-700 font-medium tracking-tighter disabled:cursor-default cursor-pointer w-fit p-2 rounded-full shadow-2xl transition-all select-none"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {Object.keys(stages).map((stage) => {
          const isValid = { state: false };
          switch (stage as keyof FormData) {
            case "f_name":
              isValid.state = firstNameRef.current?.checkValidity() ?? false;
              break;
            case "l_name":
              isValid.state = lastNameRef.current?.checkValidity() ?? false;
              break;
            case "email":
              isValid.state = emailRef.current?.checkValidity() ?? false;
              break;
            case "password":
              isValid.state = passwordRef.current?.checkValidity() ?? false;
              break;
          }
          return (
            <Fragment key={stage}>
              <button
                type="button"
                title={FormState[stage as keyof FormData]}
                id={stage}
                className={`w-9 h-9 shadow-xl cursor-pointer transition-colors ${
                  activeStage === stage
                    ? "bg-[var(--accent)]"
                    : isValid.state
                    ? "bg-emerald-500"
                    : "bg-white"
                } rounded-full`}
                onClick={() => setActiveStage(stage as keyof FormData)}
              />
              <div className="w-1 h-8 shadow-xl bg-black" />
            </Fragment>
          );
        })}
        <button
          id="submission"
          title="Submit"
          disabled={!formValid || loading}
          className={`w-9 h-9 shadow-xl cursor-pointer transition-colors flex items-center justify-center disabled:text-black/50 text-black
             disabled:bg-white/30 bg-white hover:disabled:animate-wiggle disabled:cursor-not-allowed rounded-full`}
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <CheckMark className="pt-1" />
          )}
        </button>
      </div>
    </form>
  );
}
