import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp appearance={{
        elements: {
          formButtonPrimary: 'bg-slate-500 hover:bg-slate-400',
          card: 'rounded-lg shadow-lg',
        }
      }} />
    </div>
  );
}
