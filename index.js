const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')

const webhooks = new WebhooksApi({
  secret: 'pass'
})

const webhookProxyUrl = 'https://smee.io/cPuF5CJ9D3lTauuk'
const source = new EventSource(webhookProxyUrl)
source.onmessage = (event) => {
  const webhookEvent = JSON.parse(event.data)
  webhooks.verifyAndReceive({
    id: webhookEvent['x-request-id'],
    name: webhookEvent['x-github-event'],
    signature: webhookEvent['x-hub-signature'],
    payload: webhookEvent.body
  }).catch(error => {
      console.log('err', error)
  })
}

webhooks.on('*', (event) => {
  console.log('event', event.name)
})

require('http').createServer(webhooks.middleware).listen(3000)