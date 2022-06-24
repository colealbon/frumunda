import { Handler } from "@netlify/functions";
import axios from  'axios'

const handler: Handler = async (event, context) => {
  return axios.get(event.queryStringParameters.url)
  .then(response => {
    return ({
      statusCode: 200,
      body: `${response.data}`
    })
  })
  .catch(err => {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message
      })
    }
  })
}

export { handler };
