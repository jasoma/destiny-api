/**
 * ${description}
 *
 * ${parameterDocs}
 */
function ${jsMethod}(apiKey, ${parameterNames}) {
    return request({
        uri: template({
            ${parameterObject}
        }),
        headers: {
            'x-api-key': apiKey
        },
        json: true
    });
}
