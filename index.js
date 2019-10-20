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
    let owner = payload.repository.name
    let repo = payload.repository.full_name
    let head_sha = payload.check_suite.head_sha
    let repoName = 'Audit check'
    create_check_run({owner, repo, name: repoName, head_sha})
})


const create_check_run = (params) => {
    octokit.checks.create(params)
}

webhooks.on('check_run', async({ id, name, payload }) => {
    console.log(name, 'event recvddddd')
})