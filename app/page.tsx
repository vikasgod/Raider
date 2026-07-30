import Footer from "@/components/footer";
import Nav from "@/components/nav";
import PublicHome from "@/components/publicHome";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Nav />
      <PublicHome />
      <Footer /> 
    </div>
  );
}
