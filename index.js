const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const Octokit = require("@octokit/rest")
const request = require("@octokit/request")
const { App } = require("@octokit/app")

const app = new App({
    id: process.env.GITHUB_APP_IDENTIFIER,
    privateKey: process.env.GITHUB_PRIVATE_KEY
});

const octokit = new Octokit({
    async auth() {
        const installationAccessToken = await app.getInstallationAccessToken({
            installationId: process.env.INSTALLATION_ID
        });
        return `token ${installationAccessToken}`;
    }
});

const webhooks = new WebhooksApi({ secret: 'pass'});

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

webhooks.on('check_suite', async ({id,name,payload}) => {
    let owner = payload.repository.name;
    let repo = payload.repository.full_name;
    let repoName = "Audit";
    let head_sha = payload.check_suite.head_sha

    if(payload.action == 'requested' || payload.action == 'rerequested') {
        console.log('if')
        octokit.checks.create({owner, repo, name: repoName, head_sha})
    }
})