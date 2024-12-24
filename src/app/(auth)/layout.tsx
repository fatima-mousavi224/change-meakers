import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Log In",
  description: "Login in to your account",
};
const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={plusJakartaSans.className}>
        {" "}
        <Toaster
          toastOptions={{
            style: {
              background: "rgb(19, 76, 131)",
              color: "#fff",
            },
          }}
          position="bottom-right"
        />
        {children}
      </body>
    </html>
  );
}
