const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const Octokit = require("@octokit/rest")
const request = require("@octokit/request")
const { App } = require("@octokit/app")
// const request = require('request');

const webhooks = new WebhooksApi({
  secret: 'pass'
})

const octokit = new Octokit({
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
    let owner = payload.repository.name;
    let repo = payload.repository.full_name;
    let repoName = "Audit";
    let head_sha = payload.check_suite.head_sha
    octokit.request({
        method: 'POST',
        url: '/repos/:owner/:repo/check-run',
        headers: {
            accept: 'application/vnd.github.antiope-preview+json',
        },
        owner,
        repo,
        head_sha,
    });
})

webhooks.on('check_run', ({id,name,payload}) => {
    console.log(name, 'check_run rcvddd.')
})