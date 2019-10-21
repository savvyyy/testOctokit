const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const {App} = require('@octokit/app');
const {request} = require('@octokit/request')
const config = require('config');
const Octokit = require("@octokit/rest");

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
      console.log('err', error)
  })
}

webhooks.on('*', async ({ id, name, payload }) => {
  if(name === "check_suite") {
    if(payload.action === "requested" || payload.action === "rerequested") {
        console.log('if')
      let owner = "savvyyy";
      let repo = payload.repository.name;
      let repoName = "HexaKit AI";
      let head_sha = payload.check_suite.head_sha
      const data = await octokit.checks.create({
        owner,
        repo,
        name: repoName,
        head_sha
      })
      console.log('data', data)
    }
    else {
      console.log('else')
    }
    
  }
})

webhooks.on('error', (error) => {
    console.log('---- error callback ----');
    console.log(`Error occured in "${error.event.name} handler: ${error.stack}"`)
  })
  
  require('http').createServer(webhooks.middleware).listen(3000)