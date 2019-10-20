const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const Octokit = require("@octokit/rest")
const request = require("@octokit/request")
const { App } = require("@octokit/app")


const octokit = new Octokit({
    auth: process.env.SECRET_TOKEN
});

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
      console.log('error', error)
      Promise.reject()
  })
}

webhooks.on('check_suite', async ({ id, name, payload }) => {
    console.log(name, 'event receivedd')
    check_run();
})