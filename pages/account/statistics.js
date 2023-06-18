import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import ProgressBar from "@components/statistics/ProgressBar";

import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import { getUserApi } from "../api/profiles/[username]";
import { clientEnv } from "@config/schemas/clientSchema";
import { getStats } from "../api/account/statistics";
import logger from "@config/logger";
import Alert from "@components/Alert";
import Page from "@components/Page";
import PageHead from "@components/PageHead";
import { abbreviateNumber } from "@services/utils/abbreviateNumbers";
import Button from "@components/Button";
import FallbackImage from "@components/FallbackImage";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Navigation from "@components/account/manage/navigation";

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const username = session.username;
  const { status, profile } = await getUserApi(req, res, username);
  if (status !== 200) {
    logger.error(
      profile.error,
      `profile loading failed for username: ${username}`
    );

    return {
      redirect: {
        destination: "/account/no-profile",
        permanent: false,
      },
    };
  }

  let data = {};
  let profileSections = [
    "links",
    "milestones",
    "tags",
    "socials",
    "testimonials",
  ];
  let progress = {
    percentage: 0,
    missing: [],
  };

  try {
    data = await getStats(username);
  } catch (e) {
    logger.error(e, "ERROR get user's account statistics");
  }

  progress.missing = profileSections.filter(
    (property) => !profile[property]?.length
  );
  progress.percentage = (
    ((profileSections.length - progress.missing.length) /
      profileSections.length) *
    100
  ).toFixed(0);

  data.links.individual = data.links.individual.filter((link) =>
    profile.links.some((pLink) => pLink.url === link.url)
  );

  const totalClicks = data.links.individual.reduce((acc, link) => {
    return acc + link.clicks;
  }, 0);
  data.links.clicks = totalClicks;

  return {
    props: {
      data,
      profile,
      progress,
      BASE_URL: clientEnv.NEXT_PUBLIC_BASE_URL,
    },
  };
}

export default function Statistics({ data, profile, progress, BASE_URL }) {
  const dateTimeStyle = {
    dateStyle: "short",
  };
  const dailyViews = data.profile.daily.slice(-30).map((day) => {
    return {
      views: day.views,
      date: new Intl.DateTimeFormat("en-GB", dateTimeStyle).format(
        new Date(day.date)
      ),
    };
  });

  return (
    <>
      <PageHead
        title="LinkFree Statistics"
        description="Private statistics for your account"
      />

      <Page>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <h2 className="sr-only" id="profile-overview-title">
            Profile Overview
          </h2>
          <div className="bg-white p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0">
                  <FallbackImage
                    src={`https://github.com/${profile.username}.png`}
                    width="100"
                    height="100"
                    className="mx-auto h-20 w-20 rounded-full"
                    alt={`Profile picture for GitHub user "${profile.username}"`}
                  />
                </div>
                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                  <p className="text-sm font-medium text-gray-600">
                    Welcome back,
                  </p>
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {profile.name}
                  </p>
                  <ReactMarkdown className="text-sm font-medium text-gray-600">
                    {profile.bio}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="mt-5 flex justify-center sm:mt-0">
                <Button href={`${BASE_URL}/${profile.username}`} primary={true}>
                  VIEW PROFILE
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-6 py-5 text-center text-sm font-medium">
              <span className="text-gray-900">
                {abbreviateNumber(data.profile.monthly)}
              </span>{" "}
              <span className="text-gray-600">Profile views last 30 days</span>
            </div>
            <div className="px-6 py-5 text-center text-sm font-medium">
              <span className="text-gray-900">
                {abbreviateNumber(data.profile.total)}
              </span>{" "}
              <span className="text-gray-600">Total Profile views</span>
            </div>
            <div className="px-6 py-5 text-center text-sm font-medium">
              <span className="text-gray-900">
                {abbreviateNumber(data.links.clicks)}
              </span>{" "}
              <span className="text-gray-600">Total link clicks</span>
            </div>
          </div>
        </div>
        <div className="w-full border p-4 my-6 dark:border-primary-medium">
          <span className="flex flex-row justify-between">
            <span className="text-lg font-medium text-primary-medium dark:text-primary-low">
              Profile Completion: {progress.percentage}%
            </span>
            {progress.missing.length > 0 && (
              <span className="text-primary-medium-low">
                (missing sections in your profile are:{" "}
                {progress.missing.join(",")})
              </span>
            )}
          </span>

          <ProgressBar progress={progress} />
        </div>

        {!data.links && (
          <Alert type="warning" message="You don't have a profile yet." />
        )}

        <Navigation />

        <div className="border mb-6 dark:border-primary-medium">
          <div className="border-b border-primary-low bg-white dark:bg-primary-high dark:border-primary-medium px-4 py-5 mb-2 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-primary-high">
              Profile views
            </h3>
            <p className="mt-1 text-sm text-primary-medium dark:text-primary-medium-low">
              Number of Profile visits per day.
            </p>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer height="100%">
              <BarChart data={dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    color: "black",
                  }}
                />
                <Bar dataKey="views" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <table className="min-w-full divide-y divide-primary-medium-low">
          <thead className="bg-primary-low dark:bg-primary-medium">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-primary-high dark:text-primary-low sm:pl-6"
              >
                Your Links ({data.links.individual.length})
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-primary-high"
              >
                Clicks ({abbreviateNumber(data.links.clicks)})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-low dark:divide-primary-medium bg-white dark:bg-primary-high">
            {data.links &&
              data.links.individual.map((link) => (
                <tr key={link.url}>
                  <td className="md:whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary-high dark:text-primary-low sm:pl-6">
                    {link.url}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-primary-medium dark:text-primary-low">
                    {abbreviateNumber(link.clicks)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Page>
    </>
  );
}
