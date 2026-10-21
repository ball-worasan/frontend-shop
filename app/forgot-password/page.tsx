import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
export const metadata: Metadata = { title: "กู้รหัสผ่าน" };
export default function ForgotPasswordPage() { return <AuthForm mode="recover" />; }
