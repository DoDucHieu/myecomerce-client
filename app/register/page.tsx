import { AuthCard } from "@/app/components/auth/auth-card";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Join My Ecommerce to shop faster and track your orders"
    >
      <RegisterForm />
    </AuthCard>
  );
}
