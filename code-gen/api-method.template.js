/**
 * ${description}
 *
 * @param parameters - the parameters to pass in the request.${parameterDefinitions}
 * @see <a href="${bungieDocs}">Official Bungie Reference</a>
 * @see <a href="http://bungienetplatform.wikia.com/wiki/${canonicalName}">Community API Reference</a>
 */
${methodName}(parameters) {
    let request = new requests.${requestClass}(this.apiKey, parameters);
    return this.execute(request);
}
