import BackToTop from "./Buttons/BackToTop";
import Footer from "./Footer";
import Head from "./Head";
import Nav from "./Nav";
interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="bg-white">
      <Head title={title} />
      <Nav />
      <div className="h-screen bg-gray-100">
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
