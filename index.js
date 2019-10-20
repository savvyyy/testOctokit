const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const { App } = require("@octokit/app")
const Octokit = require("@octokit/rest")
const { request } = require("@octokit/request")



const app = new App({ id: process.env.GITHUB_APP_IDENTIFIER, privateKey: process.env.GITHUB_PRIVATE_KEY });

const octokit = new Octokit({
    async auth() {
    const installationAccessToken = await app.getInstallationAccessToken({
        installationId: process.env.SECRET_TOKEN
    });
    return `token ${installationAccessToken}`;
    }
});


// const octokit =  new Octokit({ auth: { username: "octocat", password: "secret"}});


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

    if(payload.action === 'requested' || payload.action === 'rerequested') {
        let owner = payload.repository.name
        let repo = payload.repository.full_name
        let head_sha = payload.check_suite.head_sha
        let repoName = 'Audit check'
        create_check_run({owner, repo, name: repoName, head_sha})
    }
})


const create_check_run = ({owner, repo, name, head_sha}) => octokit.request(`POST /repos/${owner}/${repo}/check-runs`, {
    accept: 'application/vnd.github.antiope-preview+json',
    name,
    head_sha
})

webhooks.on('check_run', async({ id, name, payload }) => {
    console.log(name, 'event recvddddd')
})