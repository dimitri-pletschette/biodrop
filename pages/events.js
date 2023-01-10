import Head from "next/head";
import { useState } from "react";
import { IconContext } from "react-icons";
import { FaListUl, FaMicrophoneAlt } from "react-icons/fa";
import {
  MdOutlineOnlinePrediction,
  MdOutlinePeople,
  MdSettingsRemote,
} from "react-icons/md";

import EventCard from "../components/event/EventCard";
import Alert from "../components/Alert";
import Page from "../components/Page";
import EventKey from "../components/event/EventKey";
import UserTabs from "../components/user/UserTabs";
import { BiSortAlt2 } from "react-icons/bi";

export async function getServerSideProps(context) {
  let events = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
    events = await res.json();
  } catch (e) {
    console.log("ERROR search users", e);
  }

  return {
    props: { events },
  };
}

export default function Events({ events }) {
  const [eventType, seteventType] = useState("all");

  let categorisedEvents = {
    all: events,
    virtual: events.filter((event) => event.isVirtual === true),
    inPerson: events.filter((event) => event.isInPerson === true),
    cfpOpen: events.filter((event) =>
      event.date.cfpClose ? new Date(event.date.cfpClose) > new Date() : false
    ),
  };
  const filters = [
    {
      title: "Show all",
      description: "List all events with no filters",
      key: "all",
      icon: FaListUl,
      current: true,
    },
    {
      title: "CFP open",
      description: "You can submit a talk to this conference",
      key: "cfpOpen",
      icon: FaMicrophoneAlt,
      current: false,
    },
    {
      title: "In person",
      description: "These are in person events",
      key: "inPerson",
      icon: MdOutlinePeople,
      current: false,
    },
    {
      title: "Virtual",
      description: "Held virtually online event",
      key: "virtual",
      icon: MdOutlineOnlinePrediction,
      current: false,
    },
  ];

  let displayTabs = filters.flatMap((tab) => {
    if (tab.key === "all") {
      return { ...tab, total: categorisedEvents.all.length };
    }
    if (tab.key === "cfpOpen") {
      return { ...tab, total: categorisedEvents.cfpOpen.length };
    }
    if (tab.key === "inPerson") {
      return { ...tab, total: categorisedEvents.inPerson.length };
    }
    if (tab.key === "virtual") {
      return { ...tab, total: categorisedEvents.virtual.length };
    }
  });

  const [tabs, setTabs] = useState(displayTabs);
  const [sortEvents, setSortEvents] = useState(categorisedEvents);

  // console.log(tabs, "bing bing boo");
  return (
    <>
      <Head>
        <title>Events the community members are going to</title>
        <meta name="description" content="Search LinkFree user directory" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <h1 className="text-4xl mb-4 font-bold">Community events</h1>
        {/* previous code */}
        {/* <EventKey
          categorisedEvents={categorisedEvents}
          onToggleEventType={(newValue) => seteventType(newValue)}
        /> */}

        {/* {!events.length && <Alert type="info" message="No events found" />}
        <ul role="list" className="divide-y divide-gray-200">
          {categorisedEvents[eventType].map((event, index) => (
            <EventCard event={event} username={event.username} key={index} />
          ))}
        </ul> */}

        {/* new code */}
        <UserTabs2
          tabs={tabs}
          setTabs={setTabs}
          setSortEvents={setSortEvents}
          sortEvents={sortEvents}
        />

        {filters.map(
          (filter) =>
            tabs.find((tab) => tab.key === filter.key) &&
            tabs.find((tab) => tab.key === filter.key).current && (
              <ul
                key={filter.key}
                role="list"
                className="divide-y divide-gray-200 mt-6"
              >
                <h2 className="text-md md:text-2xl text-lg text-gray-600 font-bold md:mb-6 mb-3">
                  {filter.description}
                </h2>

                {categorisedEvents[filter.key].map((event, index) => (
                  <EventCard
                    event={event}
                    username={event.username}
                    key={index}
                  />
                ))}
              </ul>
            )
        )}

        {/* {tabs.find((tab) => tab.key === "all") &&
          tabs.find((tab) => tab.key === "all").current && (
            <div className="bg-red-500 p-8 mt-12">
              <h1>all</h1>
            </div>
          )}

        {tabs.find((tab) => tab.key === "cfpOpen") &&
          tabs.find((tab) => tab.key === "cfpOpen").current && (
            <div className="bg-red-500 p-8 mt-12">
              <h1>cfpOpen</h1>
            </div>
          )}

        {tabs.find((tab) => tab.key === "inPerson") &&
          tabs.find((tab) => tab.key === "inPerson").current && (
            <div className="bg-red-500 p-8 mt-12">
              <h1>inPerson</h1>
            </div>
          )}
        {tabs.find((tab) => tab.key === "virtual") &&
          tabs.find((tab) => tab.key === "virtual").current && (
            <div className="bg-red-500 p-8 mt-12">
              <h1>virtual</h1>
            </div>
          )} */}
      </Page>
    </>
  );
}

export function UserTabs2({ tabs, setTabs, sortEvents, setSortEvents }) {
  const classNames = (...classes) => classes.filter(Boolean).join(" ");
  const changeTab = (e, value) => {
    e.preventDefault();
    console.log(e.target.value);
    setTabs(
      tabs.map((tab) =>
        tab.title === e.target?.value || tab.title === value
          ? { ...tab, current: true }
          : { ...tab, current: false }
      )
    );
  };

  const getDataKeyAndSortKey = (tabName) => {
    let dataKeyObj = {};
    switch (tabName) {
      case "cfpOpen":
        dataKeyObj.dataKey = "cfpOpen";
        dataKeyObj.sortKey = "date.start";
        break;
      case "inPerson":
        dataKeyObj.dataKey = "inPerson";
        dataKeyObj.sortKey = "date.start";
        break;
      case "virtual":
        dataKeyObj.dataKey = "virtual";
        dataKeyObj.sortKey = "date.start";
        break;
      default:
        dataKeyObj.dataKey = "all";
        dataKeyObj.sortKey = "date.start";
    }
    return dataKeyObj;
  };

  const sortUserTabItems = (tabName, order, events, setEvents) => {
    const { dataKey, sortKey } = getDataKeyAndSortKey(tabName);
    sortEvents[dataKey].sort(function (a, b) {
      console.log(sortEvents[dataKey]);
      const aVal = sortKey.includes(".")
        ? getNested(a, sortKey.split("."))
        : a[sortKey];
      const bVal = sortKey.includes(".")
        ? getNested(b, sortKey.split("."))
        : b[sortKey];
      if (tabName === "My Links") {
        if (order === "ASC") {
          return aVal.toLowerCase() > bVal.toLowerCase()
            ? 1
            : aVal.toLowerCase() < bVal.toLowerCase()
            ? -1
            : 0;
        } else {
          return aVal.toLowerCase() < bVal.toLowerCase()
            ? 1
            : aVal.toLowerCase() > bVal.toLowerCase()
            ? -1
            : 0;
        }
      } else {
        if (order === "ASC") {
          return new Date(aVal) > new Date(bVal)
            ? 1
            : new Date(aVal) < new Date(bVal)
            ? -1
            : 0;
        } else {
          return new Date(aVal) < new Date(bVal)
            ? 1
            : new Date(aVal) > new Date(bVal)
            ? -1
            : 0;
        }
      }
    });
    setSortEvents({ ...sortEvents });
  };

  const getNested = (obj, args) => {
    return args.reduce((obj, level) => obj && obj[level], obj);
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          onChange={changeTab}
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs.find((tab) => tab.current)?.title}
        >
          {tabs.map((tab) => (
            <option key={tab.key}>{tab.title}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.key}
                href={tab.href}
                onClick={(e) => changeTab(e, tab.title)}
                className={classNames(
                  tab.current
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm flex justify-center items-center gap-2"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.key === "all" && (
                  <FaListUl title="Show All" className="text-base" />
                )}
                {tab.key === "virtual" && (
                  <MdOutlineOnlinePrediction
                    title="Virtual event"
                    className="text-xl"
                  />
                )}
                {tab.key === "inPerson" && (
                  <MdOutlinePeople
                    title="In person event"
                    className="text-xl"
                  />
                )}
                {tab.key === "cfpOpen" && (
                  <FaMicrophoneAlt title="CFP is open" className="text-base" />
                )}
                <span>
                  {tab.title} ({tab.total})
                </span>
                {tab.current && (
                  <BiSortAlt2
                    size="20"
                    className="hover:text-gray-400"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setTabs(
                        tabs.map((tab) =>
                          tab.current
                            ? {
                                ...tab,
                                order: tab.order === "ASC" ? "DESC" : "ASC",
                              }
                            : { ...tab }
                        )
                      );
                      sortUserTabItems(
                        tab.title,
                        tab.order === "ASC" ? "DESC" : "ASC"
                      );
                    }}
                  />
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
