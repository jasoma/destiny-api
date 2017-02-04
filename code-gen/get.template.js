/**
 * ${description}
 *
 * ${parameters.docs}
 */
${jsMethod}(${parameters.namesList}) {
    let parameters = {${parameters.object}};
    validate(parameters, ${parameters.namesArray});
    let uri = uris['${name}'](parameters);
    return this.get(uri);
}
