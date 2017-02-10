A nodejs client for the [Destiny API](https://www.bungie.net/platform/destiny/help/). Currently implements all public requests.

## Getting started

Install the package.

```bash
  npm install --save destiny-api-client
```

Create a client with your applications api key and start making requests.

```js
const DestinyApi = require('destiny-api-client');

let client = new DestinyApi('your-api-key');

client.searchPlayer({
    membershipType: DestinyApi.psn,
    displayName: 'strombane'
})
.then(response => console.log(response));
```

You can specify the host to use if you are using a proxy instead of accessing the bungie servers directly.

```js
let client = new DestinyApi('your-api-key', 'https://your.proxyhost.com');
```

More documentation to come, for now [read the docs](https://jasoma.github.io/destiny-api/DestinyApi.html) and [look at the tests](https://github.com/jasoma/destiny-api/tree/master/test) to get started.

## TODO

- [ ] Add request types that require authentication
- [ ] Add example requests and responses to the documentation
