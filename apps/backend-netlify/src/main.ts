import { Handler } from "@netlify/functions";

const handler: Handler = async (event, context) => {
    console.log('hello')
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};

export { handler };