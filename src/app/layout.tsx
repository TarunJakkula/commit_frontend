import type { Metadata } from "next";
import "./globals.css";
import { dmsans } from "@/utils/fonts";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Commit",
  description: "Version managed notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmsans.className}`}>
        <Toaster
          position="bottom-right"
          reverseOrder
          toastOptions={{
            className: "!rounded-full !bg-black !text-white !pl-5",
          }}
        />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
