import AdminSidebar from "@/components/AdminSidebar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("genbi_admin_session");

  if (!sessionCookie?.value) {
    redirect("/admin/login");
  }

  let sessionData = null;
  try {
    sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString("utf-8"));
  } catch (e) {
    redirect("/admin/login");
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <AdminSidebar session={sessionData} />
      <main style={{ flex: 1, padding: "32px", overflowY: "auto", height: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
