const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const {App} = require('@octokit/app');
const {request} = require('@octokit/request')
const config = require('config');
const Octokit = require("@octokit/rest");

const APP_ID = config.GITHUB_APP_IDENTIFIER;
const PRIVATE_KEY = config.GITHUB_PRIVATE_KEY;
const app = new App({id: APP_ID, privateKey: PRIVATE_KEY});


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
  console.log('event', event)
})

require('http').createServer(webhooks.middleware).listen(3000)