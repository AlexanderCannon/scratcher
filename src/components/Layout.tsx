import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import BackToTop from "./Buttons/BackToTop";
import Footer from "./Footer";
import Head from "./Head";
import Nav from "./Nav/Main";
import SelectRole from "./SelectRole";
import { RoleContext } from "~/context/role";
interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const { role } = useContext(RoleContext);
  return (
    <div className="bg-white">
      <Head title={title} />
      <Nav />
      {role === "USER" && <SelectRole />}
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-800 via-slate-800 to-gray-800">
        <main className="mx-auto flex h-full max-w-7xl flex-col items-center justify-start px-4 py-10 pt-28 md:px-8">
          {children}
          <BackToTop />
        </main>
        <Footer />
      </div>
    </div>
  );
};

Layout.defaultProps = {
  title: "Scratcher",
};

export default Layout;
