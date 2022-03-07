// 请求路径。修改此地址可避免公用。
const endpointPath = '/dns-query';
// 上游 DoH 地址。
const upstream = 'https://dns.google/dns-query';


/**
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.method != 'GET') {
    return new Response('method not allowed', { status: 405 });
  }

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

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});