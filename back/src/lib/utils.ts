import { IncomingHttpHeaders } from "http";
import { config } from "../config.js";
import { v4 as uid } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

export const getTracingHeader = (headers: IncomingHttpHeaders) => {
  const key = config.tracingHeader;
  const tracingId = String(headers[key]);
  return { tracingId, key };
};

export const newUid = () => uid();

export const toWwwHtmlDir = (pwd: string) => {
  const __filename = fileURLToPath(pwd); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directory
  return path.join(__dirname, "www");
};

export const getTracingId = (headers: IncomingHttpHeaders) => {
  const tracingId = headers[config.tracingHeader];
  if (!tracingId) {
    return newUid();
  }

  return tracingId;
};

export const base64URLEncode = (str: Buffer) =>
  str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
