import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";

initializeApp();


// eslint-disable-next-line max-len
export const serveImage = onRequest({region: ["asia-northeast1"], cors: ["https://hello-radiko.web.app", "http://localhost"], memory: "128MiB"}, async (req, res) => {
  // res.set('Access-Control-Allow-Origin', 'mizuha-dev.com');
  // res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST');
  // res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  const imageUrl = req.query.url as string;

  if (!imageUrl) {
    res.status(400).send("URL parameter is missing");
    return;
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      // eslint-disable-next-line max-len
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.set("Content-Type", contentType);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.status(200).send(buffer);
  } catch (error:any) {
    logger.error(error);
    res.status(500).send(`Error: ${error.message}`);
  }
});
