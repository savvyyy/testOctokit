const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const Octokit = require("@octokit/rest");

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

webhooks.on('*', async ({ id, name, payload }) => {
  if(name === "check_suite") {
    if(payload.action === "requested" || payload.action === "rerequested") {
        console.log('if')
      let owner = payload.repository.name;
      let repo = payload.repository.full_name;
      let repoName = "HexaKit AI";
      let head_sha = payload.check_suite.head_sha
      const data = octokit.checks.create({
        owner,
        repo,
        name:repoName,
        head_sha
      })
      console.log('data', data)
    }
    else {
      console.log('else')
    }
    
  }
})