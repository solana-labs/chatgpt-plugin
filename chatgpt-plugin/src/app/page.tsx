"use client";

import Head from "next/head";
import Link from "next/link";

import { features } from "@/lib/features";
import { Disclosure } from "@headlessui/react";
import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <>
      <Head>
        <title>Solana Labs - ChatGPT Plugin</title>
      </Head>

      <main className="block max-w-2xl p-4 mx-auto ">
        <section className="space-y-1 text-center">
          <h1 className="text-6xl font-semibold ">
            <Link href="/">Solana Labs</Link>
          </h1>
          <h2 className="text-2xl font-normal">ChatGPT Plugin</h2>
        </section>

        <p className="my-10 text-center">
          The Solana Labs ChatGPT Plugin helps you query information on the Solana blockchain. Solana Labs has provided the code as a reference implementation with permissive
          licensing on Github. A list of features and example queries is provided below.
        </p>

        <div className="flex items-center justify-center gap-5 my-3">
          <Link
            target="_blank"
            href={"https://github.com/solana-labs/chatgpt-plugin"}
            className="btn"
          >
            GitHub Repo
            <ArrowRightIcon />
          </Link>

          <Link target="_blank" href={"https://solana.com/ai"} className="btn">
            AI Grants
            <ArrowRightIcon />
          </Link>
        </div>

        <section className="my-10 space-y-6">
          <h2 className="text-3xl ml-3">Features</h2>
          {features.map((endpoint, id) => (
            <Disclosure key={id}>
              {({ open }) => (
                <div className="">
                  <Disclosure.Button className={`disclosure ${open ? "disclosure-open" : ""}`}>
                    {endpoint.label}
                    <span className="">{open ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-3 py-2 text-white">
                    {endpoint.description}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </section>
      </main>
    </>
  );
}
