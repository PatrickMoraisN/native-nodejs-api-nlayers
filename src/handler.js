import { parse } from "node:url";
import { DEFAULT_HEADER } from "./util/util.js";

const allRoutes = {
  '/heroes:get': async (request, response) => {
    response.write('GET');
    response.end();
  },

  // 404 routes
  default: (request, response) => {
    response.writeHead(404, DEFAULT_HEADER);
    response.write('opsssssss, not found!');
    response.end();
  },

}

export function handler(request, response) {
  const { url, method } = request;
  const { pathname } = parse(url, true);
  const key = `${pathname}:${method.toLowerCase()}`
  const chosenRoute = allRoutes[key] || allRoutes.default

  return Promise.resolve(chosenRoute(request, response))
    .catch(handlerError(response))
}

function handlerError(response) {
  return error => {
    console.log('Something wrong', error);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({
      error: 'internal server error!'
    }));

    return response.end();
  }
}