import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/adminAuth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login — VastraVedh" };

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect("/admin");

  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-sm rounded-lg bg-white p-8 shadow-card">
        <h1 className="text-center font-serif text-2xl font-bold text-maroon">
          Admin Login
        </h1>
        <p className="mt-1 text-center text-sm text-ink/60">
          VastraVedh store management
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
