// 请求路径。修改此地址可避免公用。
const endpointPath = '/dns-query';
// 上游 DoH 地址。
const upstream = 'https://dns.google/dns-query';

/**
 * @param {Request} request
 */
async function handleRequestGet(request) {
  const clientUrl = new URL(request.url);
  if (clientUrl.pathname != endpointPath) {
    return new Response('path not found', { status: 404 });
  }

  const dnsValue = clientUrl.searchParams.get('dns')

  if (dnsValue == null) {
    return new Response('missing parameters', { status: 400 });
  }

  if (request.headers.get('Accept') != 'application/dns-message') {
    return new Response('bad request header', { status: 400 });
  }

  const upstreamUrl = new URL(upstream);
  upstreamUrl.searchParams.set("dns", dnsValue)
  return await fetch(upstreamUrl.toString(), request);
}

/**
* @param {Request} request
*/
async function handleRequestPost(request) {
  if (request.headers.get('Content-Type') != 'application/dns-message') {
    return new Response('bad request header', { status: 400 });
  }
  return await fetch(upstream, {
    method: 'POST',
    headers: {
      'Accept': 'application/dns-message',
      'Content-Type': 'application/dns-message',
    },
    body: await request.arrayBuffer()
  });
}

/**
 * @param {Request} request
 */
async function handleRequest(request) {
  switch (request.method) {
    case 'GET':
      return handleRequestGet(request)
    case 'POST':
      return handleRequestPost(request)
    default:
      return new Response('method not allowed', { status: 405 });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});