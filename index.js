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
    console.log(name, 'event received')
    if(name === "check_suite") {
        let owner = payload.repository.name;
        let repo = payload.repository.full_name;
        let repoName = "Audit";
        let head_sha = payload.check_suite.head_sha
        if(payload.action === "requested" || payload.action === "rerequested") {
            create({owner,repo,name:repoName,head_sha})
        }
        else {
            let owner = payload.repository.owner.name;
            let repo = payload.repository.full_name;
            let check_run_id = payload.check_run.id;
            octokit.checks.update({
                owner,
                repo,
                check_run_id
            })
        }
        
    }
})

webhooks.on('check_run', async({id, name, payload}) => {
    console.log('check_run created')
})

const create = (params) => {
    console.log('params', params)
    octokit.checks.create(params)
}