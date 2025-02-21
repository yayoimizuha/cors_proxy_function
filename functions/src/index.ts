import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";

initializeApp();


export const serveImage = onRequest({region: ["asia-northeast1"], cors: ["hello-radiko.web.app", "localhost"]}, async (req, res) => {
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
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.set("Content-Type", contentType);
    }

    const buffer = await response.arrayBuffer();
    res.status(200).send(buffer);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send(`Error: ${error.message}`);
  }
});
