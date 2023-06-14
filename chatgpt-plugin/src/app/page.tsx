"use client";

import Head from "next/head";
import Image from "next/image";

export default function Home() {
  const arrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="ms-6"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );

  return (
    <div>
      <Head>
        <title>Solana Labs - ChatGPT Plugin</title>
      </Head>

      <nav id="navbar" className="navbar navbar-expand-lg navbar-dark">
        <div className="container-xl" style={{ marginTop: "10px" }}>
          <a className="d-flex" href="/">
            <Image
              alt="Solana"
              width="149"
              height="22"
              decoding="async"
              data-nimg="1"
              color="transparent"
              src="/solana-image.svg"
            />
          </a>
          <button
            aria-controls="navbarCollapse"
            type="button"
            aria-label="Toggle navigation"
            className="navbar-toggler collapsed"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </nav>

      <main>
        <div className="place-self-center">
          <div className="h2 AiHero_hero__title__ZatKJ">
            Solana Labs - ChatGPT Plugin
          </div>

          <div className="buttons">
            <a
              href="https://github.com/solana-labs/chatgpt-plugin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="czAcYK btn lift mr-20">
                Github Repo
                {arrow}
              </button>
            </a>
            <a
              href="https://solana.com/ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="czAcYK btn lift">AI Grants {arrow}</button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // const redirectUrl = "https://solana.com/ai";

//   // Check if the user is accessing the homepage and, if so, issue a redirect.
//   if (context.req.url === "/") {
//     // return {
//     //   redirect: {
//     //     destination: redirectUrl,
//     //     permanent: false,
//     //   },
//     // };
//   }

// If not redirecting, return empty props.
//   return { props: {} };
// };
