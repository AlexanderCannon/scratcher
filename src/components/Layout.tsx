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
    <div className="min-h-screen bg-white">
      <Head title={title} />
      <Nav />
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-start bg-gray-100 px-4 py-10 pt-28 md:px-8">
        {children}
        <BackToTop />
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Scratcher",
};

export default Layout;
