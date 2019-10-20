const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const Octokit = require("@octokit/rest");
const request = require('request')

const octokit =  new Octokit({ auth: { username: "octocat", password: "secret"}});

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
  }).catch(console.error)
}

webhooks.on('check_suite', async ({ id, name, payload }) => {
    console.log(name, 'event received')
    let head_sha = payload.check_suite.head_sha
    create_check_run(head_sha);
})

const create_check_run = (head_sha) => request('POST /repos/:owner/:repo/check-runs', {
    accept: 'application/vnd.github.antiope-preview+json',
    name: 'Audit Check',
    head_sha: head_sha
})

webhooks.on('check_run', async({ id, name, payload }) => {
    console.log(name, 'event recvddddd')
})