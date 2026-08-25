import Footer from "@/components/footer";
import Nav from "@/components/nav";
import PublicHome from "@/components/publicHome";
import { auth } from "./auth";
import PartnerDashboard from "@/components/partnerDashboard";
import AdminDashboard from "@/components/adminDashboard";
import connectDB from "@/lib/db";
import User from "@/models/user.model";

export default async function Home() {
  const session = await auth();
  await connectDB();
  const user = await User.findOne({ email: session?.user?.email });
  return (
    <div className="w-full min-h-screen bg-white">
      {user?.role == "partner" ? (
        <>
          <Nav />
          <PartnerDashboard />
        </>
      ) : user?.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <>
          <Nav />
          <PublicHome />
        </>
      )}

      <Footer />
    </div>
  );
}
