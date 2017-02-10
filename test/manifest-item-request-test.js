const assert = require('assert');
const DestinyApi = require('../destiny-api');

let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.manifestItem', () => {

    it('should load item data from the manifest', () => {
        return client.manifestItem({
                id: 12469152,
                type: 6
            })
            .then(response => {
                assert.ok(response);
                assert.equal('Nox Praeli III', response.data.inventoryItem.itemName);
            });
    });

});
