/**
 * ${description}
 *
 * ${parameters.docs}
 */
${jsMethod}(${parameters.namesList}) {
    let parameters = {${parameters.object}};
    validate(parameters, ${parameters.namesArray});
    let uri = uris['${name}'];
    return this.post(uri, parameters);
}
