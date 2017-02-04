/**
 * ${description}
 *
 * ${parameters.docs}
 */
function ${jsMethod}(apiKey, ${parameters.names}) {
    let parameters = {${parameters.object}};
    checkParameters(parameters, ${parameters.namesArray})
    return request({
        uri: uris['${name}'](parameters),
        headers: {
            'x-api-key': this.apiKey
        },
        json: true
    });
}
