// 请求路径。修改此地址可避免公用。
const endpointPath = '/dns-query';
// 上游 DoH 地址。必需是域名，不能是 IP。Cloudflare 有限制。
const upstream = 'https://dns.google/dns-query';

/**
 * @param {Request} request
 * @param {URL} clientUrl
 */
async function handleRequestGet(request, clientUrl) {
  const dnsValue = clientUrl.searchParams.get('dns')

  if (dnsValue == null) {
    return new Response('missing parameters', { status: 400 });
  }

  if (request.headers.get('accept') != 'application/dns-message') {
    return new Response('bad request header', { status: 400 });
  }

  const upstreamUrl = new URL(upstream);
  upstreamUrl.searchParams.set('dns', dnsValue);
  const upstreamRequest = new Request(upstreamUrl.toString(), {
    headers: request.headers,
    method: 'GET',
  });
  upstreamRequest.headers.set('host', upstreamUrl.hostname)
  return await fetch(upstreamRequest);
}

/**
 * @param {Request} request
 * @param {URL} clientUrl
 */
async function handleRequestPost(request, clientUrl) {
  if (request.headers.get('content-type') != 'application/dns-message') {
    return new Response('bad request header', { status: 400 });
  }
  const upstreamRequest = new Request(upstream, {
    method: 'POST',
    headers: {
      'accept': 'application/dns-message',
      'content-type': 'application/dns-message',
    },
    body: await request.arrayBuffer()
  });
  return await fetch(upstreamRequest);
}

/**
 * @param {Request} request
 */
async function handleRequest(request) {
  const clientUrl = new URL(request.url);
  if (clientUrl.pathname != endpointPath) {
    return new Response('Hello World!', { status: 404 });
  }

  switch (request.method) {
    case 'GET':
      return handleRequestGet(request, clientUrl)
    case 'POST':
      return handleRequestPost(request, clientUrl)
    default:
      return new Response('method not allowed', { status: 405 });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});