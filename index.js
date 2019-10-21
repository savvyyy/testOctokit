const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const {App} = require('@octokit/app');
const {request} = require('@octokit/request')
const config = require('config');
const Octokit = require("@octokit/rest")
const { endpoint } = require("@octokit/endpoint")
const Hook = require('before-after-hook')

const hook = new Hook.Singular()

const APP_ID = config.GITHUB_APP_IDENTIFIER;
const PRIVATE_KEY = config.GITHUB_PRIVATE_KEY;
const app = new App({id: APP_ID, privateKey: PRIVATE_KEY});
const jwt = app.getSignedJsonWebToken();

getID = async () => {
    const {data} = await request("GET /repos/:owner/:repo/installation", {
        owner: "savvyyy",
        repo: "testOctokit",
        headers: {
          authorization: `Bearer ${jwt}`,
          accept: "application/vnd.github.machine-man-preview+json"
        }
      })
    const installationId = data.id; 
    return installationId;
}
const installationId = getID();

const octokit =  new Octokit({
    async auth() {
        const installationAccessToken = await app.getInstallationAccessToken({
            installationId: installationId
        });
        return `token ${installationId}`;
    }
});

const webhookProxyUrl = 'https://smee.io/cPuF5CJ9D3lTauuk'
const source = new EventSource(webhookProxyUrl)
source.onmessage = (event) => {
  const webhookEvent = JSON.parse(event.data)
  console.log('webhookEvent', webhookEvent)
}




























// const Octokit = require('octokit')
// const { createAppAuth } = require("@octokit/auth-app")
// const config = require('config')
// const client = new Octokit()

// const APP_ID = config.GITHUB_APP_IDENTIFIER;
// const PRIVATE_KEY = config.GITHUB_PRIVATE_KEY;

// const client = new Octokit({
//     timeout: 0,
//     baseUrl: 'https://api.github.com/repos/savvyyy/testOctokit',
//     auth: createAppAuth ({
//         id: APP_ID,
//         privateKey: PRIVATE_KEY
//     }),
//     headers: {
//         accept: 'application/vnd.github.v3+json',
//         'user-agent': 'octokit/rest.js v1.2.3',
//     },
// })


