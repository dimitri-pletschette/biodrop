import Head from "next/head";
import UserCard from "../components/user/UserCard";
import Page from "../components/Page";
import { useState } from "react";
import { TbRefresh } from "react-icons/tb"

export async function getServerSideProps(context) {
  let data = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/discover`
    );
    data = await res.json();
  } catch (e) {
    console.log("ERROR loading popular profiles", e);
  }

  return {
    props: { data },
  };
}

export default function Popular({ data }) {
  const [profiles, setProfiles] = useState(data);

  const refreshProfiles = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/discover`
      );
      setProfiles(await res.json());
    } catch (e) {
      console.log("ERROR refreshing profiles", e);
    }
  };

  return (
    <>
      <Head>
        <title>Discover LinkFree Profiles</title>
        <meta
          name="description"
          content="Discover more people in your LinkFree community"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <h1 className="text-2xl md:text-4xl mb-4 font-bold">
          Discover LinkFree Profiles
        </h1>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
            <h2 className="text-md md:text-xl font-bold">
              Random LinkFree Profiles
            </h2>
            <button
              className="flex gap-3 items-center text-orange-600 border border-gray-300 font-bold hover:border-orange-600 py-2 text-md md:text-lg px-3 rounded-md "
              onClick={() => refreshProfiles()}
            >
              <TbRefresh />
              Refresh
            </button>
          </div>
          <ul className="flex flex-wrap gap-3 justify-center">
            {profiles.random.map((profile) => (
              <li key={profile.username}>
                <UserCard profile={profile} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Popular LinkFree Profiles</h2>
          <ul className="flex flex-wrap gap-3 justify-center">
            {profiles.popular.map((profile) => (
              <li key={profile.username}>
                <UserCard profile={profile} />
              </li>
            ))}
          </ul>
        </div>
      </Page>
    </>
  );
}
