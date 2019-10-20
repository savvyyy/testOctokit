const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const Octokit = require("@octokit/rest")
const request = require("@octokit/request")
const { App } = require("@octokit/app")

// const app = new App({ 
//     id: process.env.GITHUB_APP_IDENTIFIER, 
//     privateKey: process.env.GITHUB_PRIVATE_KEY 
// });

// const getInstallationAccessTokenByInstallationId = async (installationId) => {
//     const installationAccessToken = await app.getInstallationAccessToken({
//         installationId,
//     });
//     return installationAccessToken;
// };

// const getInstallationAccessToken = async (owner, repo) => {
//     const { data } = await request(`GET /repos/${owner}/${repo}/installation`,
//     {
//         headers: {
//         authorization: `Bearer ${app.getSignedJsonWebToken()}`,
//         accept: 'application/vnd.github.machine-man-preview+json',
//     },
// });

// const installationId = data.id;

// const installationAccessToken = await getInstallationAccessTokenByInstallationId(installationId);
//   return installationAccessToken;
// };

// const getInstallationClient = async (owner, repo) => {
//     const installationAccessToken = await getInstallationAccessToken(owner, repo);
//     return new Octokit({
//     auth() {
//         return `token ${installationAccessToken}`;
//     },
//     });
// };


// const octokit = new Octokit({
//     auth: process.env.SECRET_TOKEN
// });

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
    let owner = payload.repository.name;
    let repo = payload.repository.full_name;
    let repoName = "HexaKit AI";
    let head_sha = payload.check_suite.head_sha
    create_check_run({
        owner,
        repo,
        name:repoName,
        head_sha
      });
})

const create_check_run = async ({owner, repo, name, head_sha}) => await request(`POST /repos/${owner}/${repo}/check-runs`,{
    accept: 'application/vnd.github.antiope-preview+json',
    name: 'Audit',
    head_sha
})

webhooks.on('check_run', ({id,name,payload}) => {
    console.log('check_run rcvddd.')
})