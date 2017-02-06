const _ = require('lodash');
const assert = require('chai').assert;
const RequestParameters = require('../requests/request-parameters');

let definitions = [
    {
        name: 'bodyParam',
        type: 'body',
        required: false
    },
    {
        name: 'queryParam',
        type: 'query',
        required: true,
        default: 'Default'
    },
    {
        name: 'pathParam',
        type: 'path',
        required: true
    }
];

describe('RequestParameters', () => {

    it('should construct from a definition array', () =>{
        assert.isOk(new RequestParameters(definitions));
    });

    it('should fail for bad parameter types', () => {
        let copy = _.defaultsDeep([], definitions)
        copy[0].type = 'foo';
        assert.throws(() => new RequestParameters(copy));
    });

    it('should create defaults', () => {
        let params = new RequestParameters(definitions);
        let defaults = params.defaults();
        assert.equal('Default', defaults.queryParam);
        assert.notProperty(defaults, 'bodyParam');
        assert.notProperty(defaults, 'pathParam');
    });

    it('should built options', () => {
        let params = new RequestParameters(definitions);
        let options = params.buildOptions({bodyParam: 'body', queryParam: 'query', pathParam: 'path'});
        let expected = {
            body: {bodyParam: 'body'},
            query: {queryParam: 'query'},
            path: {pathParam: 'path'}
        };
        assert.deepEqual(expected, options);
    });

    it('should validate parameters', () => {
        let params = new RequestParameters(definitions);

        let full = {bodyParam: 'body', queryParam: 'query', pathParam: 'path'};
        assert.isNull(params.validate(full));

        let missingRequired = {bodyParam: 'body', pathParam: 'path'};
        assert.instanceOf(params.validate(missingRequired), Error);

        let undefRequired = {bodyParam: 'body', queryParam: undefined, pathParam: 'path'};
        assert.instanceOf(params.validate(missingRequired), Error);

        let nullRequired = {bodyParam: 'body', queryParam: null, pathParam: 'path'};
        assert.instanceOf(params.validate(nullRequired), Error);

        let falseRequired = {bodyParam: 'body', queryParam: false, pathParam: 'path'};
        assert.isNull(params.validate(falseRequired));

        let missingOptional = {queryParam: 'query', pathParam: 'path'};
        assert.isNull(params.validate(missingOptional));
    });

});
