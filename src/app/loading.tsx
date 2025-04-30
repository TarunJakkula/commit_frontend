import { LoaderCircle } from "lucide-react";
export default function Loading() {
  return (
    <div className="bg-[var(--background)] noise h-screen w-screen flex justify-center items-center">
      <LoaderCircle className="animate-spin w-20 h-20" color="#000000" />
    </div>
  );
}
