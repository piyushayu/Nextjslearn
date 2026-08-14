
import { Toaster } from "@/components/ui/toast"

export default function SigninLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
      <Toaster/>
    </div>
  );
}
