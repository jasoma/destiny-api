/**
 * ${description}
 *
 * @param parameters - the parameters to pass in the request.${parameterDefinitions}
 * @see <a href="${bungieDocs}">${canonicalName}</a>
 */
${methodName}(parameters) {
    let request = new requests.${requestClass}(this.apiKey, parameters);
    return this.execute(request);
}
