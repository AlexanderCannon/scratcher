import Footer from "./Footer";
import Head from "./Head";
import Nav from "./Nav";
interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#aabbcc] to-[#009988]">
      <Head title={title} />
      <Nav />
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Scratcher",
};

export default Layout;
