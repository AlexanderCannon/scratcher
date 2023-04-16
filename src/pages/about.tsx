import Image from "next/image";
import Layout from "~/components/Layout";

const AboutPage = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            About Us
          </h2>
        </div>
        <div className="mt-10 md:flex md:justify-between">
          <div className="md:w-1/2">
            <p className="text-xl text-white">
              Welcome to our platform, where we are committed to bringing you
              the best content and tools to help you engage with the blockchain
              and crypto world. Our team is comprised of industry experts and
              enthusiasts who are passionate about sharing their knowledge and
              insights with our community.
            </p>
            <p className="text-xl text-white">
              We believe that the blockchain is a transformative technology that
              has the potential to revolutionize many industries and aspects of
              daily life. Our goal is to make this technology accessible and
              understandable to everyone, and to create a welcoming space where
              people can connect and learn from each other.
            </p>
            <p className="text-xl text-white">
              Whether you are an experienced blockchain developer or just
              getting started with crypto, our platform has something for
              everyone. From informative articles and tutorials to a vibrant
              community forum, we strive to provide the resources and support
              you need to succeed in this exciting and rapidly-evolving field.
            </p>
            <p className="text-xl text-white">
              Thank you for being a part of our community, and we look forward
              to growing and learning with you as we continue on this journey
              together.
            </p>
          </div>
          <div className="mt-10 md:mt-0 md:w-1/2">
            <Image
              src="/images/png/placeholder-article.png"
              alt="About Us"
              width={720}
              height={480}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
