const assert = require('assert');
const DestinyApi = require('../destiny-api');

let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.exploreTalentNodes', () => {

    it('should load a page of talent node data', () => {
        return client.exploreTalentNodes()
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
            });
    });

});
