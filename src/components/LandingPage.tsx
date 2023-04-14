import { type FormEvent, useState } from "react";
import Link from "~/components/Link";
import { signIn } from "next-auth/react";
import Button from "./Buttons/Button";
import ParallaxBox from "./ParallaxBox";
import Typography from "./Typography";

export default function LandingPage() {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/auth/signin/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      const { url } = await response.json();
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-500 py-0">
        <ParallaxBox image={"/images/png/sermon.png"}>
          <h1 className="mb-4 text-center text-4xl font-bold text-white md:text-6xl">
            Welcome to the Blockchain Revolution
          </h1>
          <Typography className="mb-8 text-center text-lg text-white md:text-2xl">
            Blockchain is changing the the way creators can control their
            content, it's time to join the movement.
          </Typography>
          <Button variant="secondary" onClick={void signIn}>
            Get Started
          </Button>
        </ParallaxBox>
      </div>
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <Typography
              as="h2"
              variant="heading"
              className="mb-4 text-2xl font-bold text-blue-500 md:text-4xl"
            >
              Articles, decentralized
            </Typography>
            <Typography className="mb-8 text-center text-lg text-gray-600 md:text-xl">
              Scratcher provides a new way for writers to monetize their work
              with a permanent record of their writing on the blockchain, while
              offering readers a more engaging and personalized experience.
            </Typography>
            <Link href={"/articles"} padding="p-0">
              <Button>Learn More</Button>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Typography
              as="h2"
              variant="heading"
              className="mb-4 text-2xl font-bold text-blue-500 md:text-4xl"
            >
              See who has taken control
            </Typography>
            <Typography className="mb-8 text-center text-lg text-gray-600 md:text-xl">
              Our platform features a diverse range of talented contributors
              from around the world, providing unique perspectives and insights
              on the latest trends and topics across various industries.
            </Typography>
            <Link href={"/contributors"} padding="p-0">
              <Button>Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="container mx-auto">
          <Typography
            as="h2"
            variant="heading"
            className="mb-8 text-center text-4xl font-bold text-blue-500 md:text-6xl"
          >
            Join the Scratcher Revolution Today
          </Typography>
          <Typography className="mb-8 text-center text-lg text-gray-600 md:text-2xl">
            Sign up for our newsletter to stay up-to-date on the latest
            blockchain news and events.
          </Typography>
          <form className="flex flex-col items-center justify-center">
            <div className="mb-4 w-full md:w-1/2">
              <label
                className="mb-2 block font-bold text-gray-700"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
                id="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>
            <button
              className="hover:bg rounded-full bg-blue-500 px-6 py-3 font-bold uppercase tracking-wider text-white shadow-lg"
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div>
        <div className="sp grid grid-cols-1 gap-6 pt-6">
          <ParallaxBox image={"/images/png/sermon.png"}>
            <Typography
              as="h2"
              variant="heading"
              className="mb-4 text-center text-4xl font-bold text-white md:text-6xl"
            >
              How It Works
            </Typography>
          </ParallaxBox>
          <Typography>
            Scratcher operates as a decentralized platform that enables content
            creators to monetize their articles by selling or licensing them to
            publishers, online platforms, and news organizations on the
            blockchain.
          </Typography>
          <Typography as="h2" variant="subheading">
            Step 1: Content Creation
          </Typography>
          <Typography>
            Content creators can write articles and upload them onto the
            platform. Each article is unique and can be categorized into
            different topics, such as technology, finance, or lifestyle.
            Creators can set a price for each article they upload and choose
            whether they want to offer it as a non-exclusive digital asset.
          </Typography>
          <Typography as="h2" variant="subheading">
            Step 2: Asset Creation
          </Typography>
          <Typography>
            Once an article is uploaded, the platform creates a unique digital
            asset for that specific article on the blockchain. The asset
            contains information about the article, such as its title, author,
            and content. It also includes metadata that verifies the
            authenticity and ownership of the article.
          </Typography>
          <Typography as="h2" variant="subheading">
            Step 3: Asset Listing
          </Typography>
          <Typography>
            After an asset is created, content creators can list it on the
            marketplace for publishers, online platforms, and news organizations
            to discover and purchase. The asset is listed alongside other
            digital assets on the platform, and potential buyers can browse the
            marketplace to find articles they are interested in buying or
            licensing.
          </Typography>
          <Typography as="h2" variant="subheading">
            Step 4: Asset Purchase or Licensing
          </Typography>
          <Typography>
            When a buyer decides to purchase or license an article, they buy the
            associated digital asset on the blockchain. The platform facilitates
            the transaction using cryptocurrency, and the digital asset is
            transferred to the buyer's digital wallet. The content creator is
            always credited for the article and receives a percentage of the
            sale or licensing fee as a royalty for each transaction.
          </Typography>
          <Typography as="h2" variant="subheading">
            Step 5: Article Access
          </Typography>
          <Typography>
            Once a buyer owns a digital asset, they can access the associated
            article on the platform. The article can be viewed and downloaded in
            different formats, such as raw text, markdown, or HTML. Buyers can
            also connect directly to their CMS or blogging platform, such as
            Substack, to seamlessly import the article into their platform.
          </Typography>
          <Typography as="h2" variant="subheading">
            Step 6: Article Syndication
          </Typography>
          <Typography>
            Buyers can syndicate the article to their own platform or
            publication. The article can be republished or excerpted in
            accordance with the licensing agreement. The content creator
            receives a percentage of the licensing fee as a royalty for each
            syndication.
          </Typography>
          <Typography as="h2" variant="subheading">
            Step 7: Article Promotion
          </Typography>
          <Typography>
            Content creators can promote their articles on the platform through
            various means, such as advertising, social media, or collaboration
            with other creators. By promoting their articles, creators can
            increase their visibility and attract more potential buyers to
            purchase or license their digital assets.
          </Typography>
          <Typography>
            The article distribution marketplace enables content creators to
            monetize their articles by selling or licensing them to publishers,
            online platforms, and news organizations on the blockchain. With the
            power of blockchain technology, the platform ensures that each
            article is unique, verifiable, and secure, providing a transparent
            and fair system for creators and buyers alike. Buyers can receive
            articles in different formats and connect directly to their CMS,
            allowing for seamless integration into their existing platform.
          </Typography>
        </div>
      </div>
    </div>
  );
}
