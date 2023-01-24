import Link from "next/link";
import { FaMicrophoneAlt } from "react-icons/fa";
import {
  MdOutlineOnlinePrediction,
  MdOutlinePeople,
  MdOutlineArrowRightAlt,
} from "react-icons/md";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

import FallbackImage from "../FallbackImage";

export default function EventCard({ event, username, name }) {
  const fallbackImageSize = 60;
  const dateTimeStyle = {
    dateStyle: "full",
    timeStyle: "long",
  };

  return (
    <li
      className="py-4 border-l-2 mb-4 pl-2 hover:border-l-4 pr-2 shadow-md"
      style={{
        borderColor: event.color,
      }}
    >
      <div className="flex space-x-3">
        <div className="flex flex-col place-content-center">
          {event.isVirtual && (
            <MdOutlineOnlinePrediction title="Virtual event" />
          )}
          {event.isInPerson && <MdOutlinePeople title="In person event" />}
          {event.date.cfpClose &&
            new Date(event.date.cfpClose) > new Date() && (
              <FaMicrophoneAlt title="CFP is open" />
            )}
        </div>
        <div className="flex-1 space-y-1">
          {!username && event.userStatus && (
            <div className="flex space-x-2">
              <p>
                {name} is{" "}
                <span
                  className="font-bold"
                  style={{
                    color: event.color,
                  }}
                >
                  {event.userStatus}
                </span>{" "}
                {event.userStatus == "speaking" && "at"} this event.
              </p>
              {event.userStatus == "speaking" && (
                <p>
                  ( <span className="font-bold">Topic: </span>{" "}
                  {event.speakingTopicDetails.topic} )
                </p>
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={event.url}
                key={event.url}
                target="_blank"
                rel="noreferrer"
                className="text-lg lg:text-xl tracking-wide font-medium capitalize"
              >
                {event.name}
              </Link>
              <p className="text-sm text-gray-800 flex flex-col lg:flex-row gap-2">
                <span>
                  {new Intl.DateTimeFormat("en-GB", dateTimeStyle).format(
                    new Date(event.date.start)
                  )}
                </span>
                <MdOutlineArrowRightAlt className="self-center hidden lg:block" />
                <span>
                  {new Intl.DateTimeFormat("en-GB", dateTimeStyle).format(
                    new Date(event.date.end)
                  )}
                </span>
              </p>
              <ReactMarkdown className="text-sm text-gray-500 py-1 flex-wrap">
                {event.description}
              </ReactMarkdown>
            </div>
            {username && (
              <Link
                href={`/${username}`}
                className="group hidden lg:block flex-shrink-0 lg:pr-4"
              >
                <FallbackImage
                  src={`https://github.com/${username}.png`}
                  alt={`Profile picture of ${username}`}
                  width={fallbackImageSize}
                  height={fallbackImageSize}
                  fallback={username}
                  className="rounded-full"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
