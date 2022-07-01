import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { countAllRequests } from "./monitoring";

import AWS from "aws-sdk";

const s3 = new AWS.S3();

exports.handler = async (event: APIGatewayProxyEvent, context: Context) => {
  console.info("Serving lambda request.");

  const result = await s3.listBuckets().promise();
  console.log("UIA!");
  const count = countAllRequests();

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: `Hello lambda - found ${result.Buckets?.length || 0} buckets`,
  };
  
  await new Promise((resolve, rej) => {
    count(event, response, () => {
      return resolve(true);
    });
  });

  return response;
};
