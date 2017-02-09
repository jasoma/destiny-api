/**
 * ${description}
 *
 * @param parameters - the parameters to pass in the request.${parameterDefinitions}
 * @see {@link ${bungieDocs}|${canonicalName}}
 */
${methodName}(parameters) {
    let request = new requests.${requestClass}(this.apiKey, parameters);
    return this.execute(request);
}
