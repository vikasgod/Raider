import Footer from "@/components/footer";
import Nav from "@/components/nav";
import PublicHome from "@/components/publicHome";
import Image from "next/image";
import { auth } from "./auth";
import PartnerDashboard from "@/components/partnerDashboard";
import AdminDashboard from "@/components/adminDashboard";

export default async function Home() {
  const session = await auth();
  return (
    <div className="w-full min-h-screen bg-white">
      <Nav />
      {session?.user?.role == "partner" ? (
        <PartnerDashboard />
      ) : session?.user?.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <PublicHome />
      )}

      <Footer />
    </div>
  );
}
