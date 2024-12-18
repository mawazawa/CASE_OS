import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn appearance={{
        elements: {
          formButtonPrimary: 'bg-slate-500 hover:bg-slate-400',
          card: 'rounded-lg shadow-lg',
        }
      }} />
    </div>
  );
}
