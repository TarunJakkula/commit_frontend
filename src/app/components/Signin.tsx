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
  email: string;
  password: string;
};

const DEFAULT_OPTIONS: FormData = {
  email: "",
  password: "",
};

enum FormState {
  email = "Email",
  password = "Password",
}

enum FormDesc {
  email = "Enter your email id.",
  password = "Enter you password.",
}

type Response = {
  data: {
    token: string;
    uid: string;
    email: string;
  };
  message: string;
};

export default function Signin() {
  const [stages, setStages] = useState<FormData>(DEFAULT_OPTIONS);
  const [activeStage, setActiveStage] = useState<keyof FormData>("email");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [formValid, setFormValid] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post<Response>(
        "/auth/login",
        stages
      );
      setLoading(false);
      setStages(DEFAULT_OPTIONS);
      setActiveStage("email");
      toast.success(data.message);
      const { email, uid, token } = data.data;
      dispatch(setUser({ email, uid }));
      document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24}`;
      router.replace("/home");
    } catch (e: any) {
      setLoading(false);
      if (e?.response?.data?.error) toast.error(e?.response?.data?.error);
      else if (e?.response?.data?.validation_errors) {
        const validation_errors = e?.response?.data?.validation_errors as {
          msg: string;
        }[];
        for (const i of validation_errors) {
          toast.error(i.msg);
        }
      } else toast.error("Error signing up");
    }
  };

  const handleStateChange =
    (stage: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) =>
      setStages((state) => ({
        ...state,
        [stage]: e.target.value,
      }));

  const handleNext = (activeStage: keyof FormData) => () => {
    if (emailRef.current && !emailRef.current.checkValidity()) {
      emailRef.current.reportValidity();
      return;
    }
    if (activeStage === "email") setActiveStage("password");
  };

  const handlePrev = (activeStage: keyof FormData) => () => {
    if (passwordRef.current && !passwordRef.current.checkValidity()) {
      passwordRef.current.reportValidity();
      return;
    }
    if (activeStage === "password") setActiveStage("email");
  };

  useEffect(() => {
    const emailValid = emailRef.current?.checkValidity() ?? false;
    const passwordValid = passwordRef.current?.checkValidity() ?? false;
    setFormValid(emailValid && passwordValid);
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
            disabled={activeStage === "email" || loading}
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
