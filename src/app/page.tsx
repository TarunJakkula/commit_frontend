import { Version } from "@/ui/icons";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import { cookies } from "next/headers";

type Props = Promise<{
  auth?: "signin" | "signup";
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Props;
}) {
  const { auth } = await searchParams;

  if (!auth) return { title: "Commit" };
  if (auth !== "signin" && auth !== "signup") return notFound();

  return {
    title: auth === "signin" ? "Sign in" : "Sign up",
  };
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Props;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (accessToken) {
    return redirect("/home");
  }

  const { auth } = await searchParams;
  if (!auth) redirect(`/?auth=signin`);
  if (auth !== "signin" && auth != "signup") notFound();

  return (
    <div className=" w-screen text flex">
      <div className="bg-[var(--background)] noise flex flex-1 flex-col gap-20 h-screen p-20 relative justify-between">
        <Version className="text-black opacity-10 rotate-y-180 w-auto h-full absolute top-0 right-0" />
        <header className="w-full flex items-center z-[1] text-[var(--primary)] font-semibold tracking-tighter text-4xl fixed top-20">
          c<span className="text-[var(--accent)]">o</span>mm
          <Version className="text-[var(--accent)]" />t
        </header>
        <div />
        <span className=" text-[var(--primary)] z-[1] font-medium tracking-tighter text-8xl">
          Version managed <br /> notes
        </span>
        <div className="flex gap-10 z-[1]">
          <Link
            replace
            href={{ pathname: "/", query: { auth: "signin" } }}
            className={`text-[var(--primary)] ${
              auth === "signin" &&
              " bg-[var(--accent)] text-white shadow-xl px-10"
            } font-medium py-2 rounded-full tracking-tighter text-md  transition-all`}
          >
            Sign in
          </Link>
          <Link
            replace
            href={{ pathname: "/", query: { auth: "signup" } }}
            className={`text-[var(--primary)] ${
              auth === "signup" &&
              " bg-[var(--accent)] text-white shadow-xl px-10"
            } font-medium py-2 rounded-full tracking-tighter text-md transition-all`}
          >
            Sign up
          </Link>
        </div>
      </div>
      <div className="noise-with-gradient flex flex-col items-end justify-between w-[700px] h-screen p-20 gap-10">
        {auth === "signin" && (
          <>
            <span className="[writing-mode:vertical-rl] font-black text-9xl text-black/10">
              SIGN <br />
              IN
            </span>
            <Signin />
          </>
        )}
        {auth === "signup" && (
          <>
            <span className="[writing-mode:vertical-rl] font-black text-9xl text-black/10">
              SIGN <br />
              UP
            </span>
            <Signup />
          </>
        )}
      </div>
    </div>
  );
}
