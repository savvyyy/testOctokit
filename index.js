const EventSource = require('eventsource');
const WebhooksApi = require('@octokit/webhooks')
const EventHandler = require('@octokit/webhooks/event-handler')

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

webhooks.on('check_suite', async ({ id, name, payload }) => {
    let owner = payload.repository.name;
    let repo = payload.repository.full_name;
    let repoName = "Audit";
    let head_sha = payload.check_suite.head_sha

    if(payload.action == 'requested' || payload.action == 'rerequested') {
        console.log('iffff')
        const EventHandler = require('@octokit/webhooks/event-handler')
        const eventHandler = new EventHandler({
        async transform (event) {
            // optionally transform passed event before handlers are called
            return event
        }
        })
        eventHandler.on('installation', asyncInstallationHook)

        // put this inside your webhooks route handler
        eventHandler.receive({
            id: request.headers['x-github-delivery'],
            name: request.headers['x-github-event'],
            payload: request.body
        }).catch(handleErrorsFromHooks)
    }
})