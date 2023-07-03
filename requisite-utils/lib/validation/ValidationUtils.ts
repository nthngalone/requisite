import Ajv, { AnySchema } from 'ajv';
import addFormats from 'ajv-formats';
import { isNotBlank } from '../lang/StringUtils';

export interface ValidationResult {
    valid: boolean;
    errors?: ValidationErrors;
    message?: string;
}

export interface ValidationErrors {
    [index: string]: ValidationFieldErrors;
}

export interface ValidationFieldErrors {
    failed: ValidationErrorGroup;
}

export interface ValidationErrorGroup {
    [index: string]: boolean;
}

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajv.addKeyword({
    type: 'string',
    keyword: 'isNotBlank',
    validate: function(schema: unknown, data: string) {
        return isNotBlank(data);
    },
    errors: false
});
ajv.addKeyword({
    type: 'string',
    keyword: 'matchesProperty',
    validate: function(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema: any, data: string, parentSchema: unknown, dataCxt: any
    ) {
        return (data === dataCxt.rootData[schema.property]);
    },
    errors: false
});

export function validate(obj: unknown, schema: unknown): ValidationResult {
    const ajvValidate = ajv.compile(schema as AnySchema);
    const valid = ajvValidate(obj) as boolean;
    const result: ValidationResult = {
        valid
    };
    if (!valid) {
        result.errors = {};
        if (ajvValidate.errors) {
            ajvValidate.errors.forEach((error) => {
                let field;
                if (isNotBlank(error.instancePath)) {
                    field = error.instancePath;
                } else {
                    field = isNotBlank(error.schemaPath) && error.schemaPath.includes('#/properties')
                        ? error.schemaPath.split('/')[2]
                        : '';
                }
                field += isNotBlank(error.params.missingProperty)
                    ? '/' + error.params.missingProperty
                    : '';
                field = field[0] === '/' ? field.substring(1) : field;
                field = field.replace(/\//gi, '.');
                if (!result.errors || !result.errors[field]) {
                    result.errors = result.errors || {};
                    result.errors[field] = {
                        failed: {}
                    };
                }
                result.errors[field].failed[error.keyword] = true;
            });
        }
    }
    return result;
}
