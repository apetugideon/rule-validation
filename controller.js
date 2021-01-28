const routeHandlers = {};

routeHandlers.index = (data, callback) => {
    callback(200, {
        "message": "My Rule-Validation API",
        "status": "success",
        "data": {
            "name": "Apetu Gideon Oluwatoyin",
            "github": "@apetugideon",
            "email": "apetugideon@gmail.com",
            "mobile": "09039419903",
            "twitter": "@is_bugshunter"
        }
    });
}

routeHandlers.resourceNotFound = (data, callback) => {
    callback(404, {
        "message": "Resource not found",
        "status": "error",
        "data": {}
    });
}

const responseMessage = {
    invalidPayload: {
        "message": "Invalid JSON payload passed.", 
        "status": "error", 
        "data": null
    },
    noRule: {
        "message": "rule is required.", 
        "status": "error", 
        "data": null
    },
    noData: {
        "message": "data is required.", 
        "status": "error", 
        "data": null
    },
    ruleNotObject: {
        "message": "rule should be an object.", 
        "status": "error", 
        "data": null
    },
    invalidData: {
        "message": "data should be an object, array or a string.", 
        "status": "error", 
        "data": null
    }
}

const ruleValidation = (fieldValue, condition, condition_value) => {
    condition = condition.toUpperCase().trim();
    let returnStatus = false;
    switch(condition) {
        case "EQ":
            returnStatus = (fieldValue === condition_value);
            break;
        case "NEQ":
            returnStatus = (fieldValue !== condition_value);
            break;
        case "GT":
            returnStatus = (fieldValue > condition_value);
            break;
        case "GTE":
            returnStatus = (fieldValue >= condition_value);
            break;
        case "CONTAINS":
            returnStatus = fieldValue.includes(condition_value);
            break;
        default:
            returnStatus = false;
    }
    return returnStatus;
}

const validationHandler = (rule, data, callback) => {
    const { field, condition, condition_value } = rule;
    const currData = data;
    let [first, second, third] = field.split(".");

    let fieldValue = currData[first];
    if ((second) && (second in fieldValue)) fieldValue = fieldValue[second];
    if ((third) && (third in fieldValue)) fieldValue = fieldValue[third];

    if (fieldValue) {
        let validation = ruleValidation(fieldValue, condition, condition_value);
        if (validation) {
            callback(200, {
                "message": `field ${field} successfully validated.`,
                "status": "success",
                "data": {
                    "validation": {
                        "error": false,
                        "field": field,
                        "field_value": field,
                        "condition": condition,
                        "condition_value": condition_value
                    }
                }
            });
        } else {
            callback(400, {
                "message": `field ${field} failed validation.`,
                "status": "error",
                "data": {
                    "validation": {
                        "error": true,
                        "field": field,
                        "field_value": field,
                        "condition": condition,
                        "condition_value": condition_value
                    }
                }
            });
        }
    } else {
        callback(400, {
            "message": `field ${field} is missing from data.`, "status": "error", "data": null
        });
    }
}

const resolveRuleNdata = (inData, callback) => {
    const { rule, data } = inData;

    (typeof rule !== 'object') ? callback(400, responseMessage['ruleNotObject']) : 
    (!(['object', 'string'].includes(typeof data))) ? callback(400, responseMessage['invalidData']) :
    validationHandler(rule, data, callback);
}

const handRuleNdata = (inData, callback) => {
    (!('rule' in inData)) ? callback(400, responseMessage['noRule']) :
    (!('data' in inData)) ? callback(400, responseMessage['noData']) :
    resolveRuleNdata(inData, callback);
}

routeHandlers.validateRule = (inData, callback) => {
    inData = JSON.parse(inData);

    (typeof inData !== 'object') ? callback(400, responseMessage['invalidPayload']) : 
        handRuleNdata(inData, callback);
}

module.exports = routeHandlers;