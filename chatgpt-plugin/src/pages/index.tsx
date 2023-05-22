import { GetServerSideProps } from "next";

export default function Home() {
  // This function will never be called because the server-side redirect
  // will happen before the page is rendered.
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirectUrl = "https://solana.com/ai";

  // Check if the user is accessing the homepage and, if so, issue a redirect.
  if (context.req.url === "/") {
    return {
      redirect: {
        destination: redirectUrl,
        permanent: true,
      },
    };
  }

  // If not redirecting, return empty props.
  return { props: {} };
};
