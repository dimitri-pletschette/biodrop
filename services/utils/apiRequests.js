import { clientEnv } from "@config/schemas/clientSchema";

function getRequestOptions({ method, body }) {
  const options = {
    method: method ? method : "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
}

export async function sendRequest({ url, method, body }) {
  const reqUrl = `${clientEnv.NEXT_PUBLIC_BASE_URL}${url}`;
  try {
    const res = await fetch(reqUrl, getRequestOptions({ method, body }));
    const data = await res.json();
    if (!res.ok) {
      throw data.message || data.error || res.statusText;
    }
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function formatErrorMsg(err) {
  let errorMsg = err;
  if (typeof err === "object") {
    errorMsg = Object.keys(err)
      .map((val) => `${val} is required`)
      .join(", ");
  }
  return errorMsg;
}
