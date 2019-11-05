const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const {App} = require('@octokit/app');
const {request} = require('@octokit/request')
const config = require('config');
const Octokit = require("@octokit/rest");

const APP_ID = config.GITHUB_APP_IDENTIFIER;
const PRIVATE_KEY = config.GITHUB_PRIVATE_KEY;
const proxy = config.HTTP_PROXY;
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
        return `token ${installationAccessToken}`;
    }
});


console.log('sadnsbjksdfcbdshgfddsadsahcsddsvhhjdsghyghghjdshfb')
