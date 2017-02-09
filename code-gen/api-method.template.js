/**
 * ${description}
 */
${methodName}(parameters) {
    let request = new requests.${requestClass}(this.apiKey, parameters);
    return this.execute(request);
}
