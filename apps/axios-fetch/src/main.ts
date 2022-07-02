import { Handler } from "@netlify/functions";
import axios from  'axios'
import { setupCache } from 'axios-cache-adapter'

const cache = setupCache({
  maxAge: 15 * 60 * 1000
})

const axiosWithCache = axios.create({
  adapter: cache.adapter
})

const handler: Handler = async (event, context) => {
  return axiosWithCache.get(event.queryStringParameters.url)
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
