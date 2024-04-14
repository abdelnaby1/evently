import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-primary-50 bg-dotted-pattern bg-cover bg-fixed">
      {children}
    </div>
  );
}
