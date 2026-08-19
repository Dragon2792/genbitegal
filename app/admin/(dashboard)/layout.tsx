import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
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
    <AdminLayoutWrapper session={sessionData}>
      {children}
    </AdminLayoutWrapper>
  );
}
