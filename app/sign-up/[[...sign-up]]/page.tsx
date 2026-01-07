// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp 
        routing="virtual"
        signInUrl="/sign-in"
        appearance={{
          elements: {
            formButtonPrimary: "bg-green-600 hover:bg-green-700",
            footerActionLink: "text-green-600 hover:text-green-800"
          }
        }}
      />
    </div>
  );
}