import Navbar from "@/app/_components/navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="mx-5 py-12">
        <div className="container">{children} </div>
      </main>
    </>
  );
}
