import { validate } from './ValidationUtils';

describe('validation/ValidationUtils:validate', () => {

    it('returns validation errors for missing required fields', () => {
        const schema: unknown = {
            type: 'object',
            required: ['missingRequiredField']
        };
        const result = validate({}, schema);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toBeTruthy();
        expect(Object.keys(result.errors).length).toBe(1);
        expect(result.errors.missingRequiredField).toBeTruthy();
        expect(result.errors.missingRequiredField.failed).toBeTruthy();
        expect(result.errors.missingRequiredField.failed.required).toBeTruthy();
    });

    it('returns validation errors for empty isNotBlank fields', () => {
        const schema: unknown = {
            type: 'object',
            properties: {
                blankField: {
                    type: 'string',
                    isNotBlank: true
                }
            },
            required: ['blankField']
        };
        const result = validate({ blankField: ''}, schema);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toBeTruthy();
        expect(Object.keys(result.errors).length).toBe(1);
        expect(result.errors.blankField).toBeTruthy();
        expect(result.errors.blankField.failed).toBeTruthy();
        expect(result.errors.blankField.failed.isNotBlank).toBeTruthy();
    });

    it('returns validation errors for whitespace isNotBlank fields', () => {
        const schema: unknown = {
            type: 'object',
            properties: {
                blankField: {
                    type: 'string',
                    isNotBlank: true
                }
            },
            required: ['blankField']
        };
        const result = validate({ blankField: '  '}, schema);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toBeTruthy();
        expect(Object.keys(result.errors).length).toBe(1);
        expect(result.errors.blankField).toBeTruthy();
        expect(result.errors.blankField.failed).toBeTruthy();
        expect(result.errors.blankField.failed.isNotBlank).toBeTruthy();
    });

    it('returns NO validation errors for valid isNotBlank fields', () => {
        const schema: unknown = {
            type: 'object',
            properties: {
                validField: {
                    type: 'string',
                    isNotBlank: true
                }
            },
            required: ['validField']
        };
        const result = validate({ validField: '123'}, schema);
        expect(result.valid).toBeTruthy();
        expect(result.errors).toBeFalsy();
    });

    it('handles nested fields', () => {
        const schema: unknown = {
            type: 'object',
            properties: {
                object1: {
                    type: 'object',
                    properties: {
                        field1: {
                            type: 'string',
                            isNotBlank: true
                        }
                    },
                    required: ['field1']
                }
            },
            required: ['object1']
        };
        const result = validate({ object1: {}}, schema);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toBeTruthy();
        expect(result.errors['object1.field1'].failed).toBeTruthy();
        expect(result.errors['object1.field1'].failed.required).toBeTruthy();

        const result2 = validate({ object1: { field1: '' }}, schema);
        expect(result2.valid).toBeFalsy();
        expect(result2.errors).toBeTruthy();
        expect(result2.errors['object1.field1'].failed).toBeTruthy();
        expect(result2.errors['object1.field1'].failed.isNotBlank).toBeTruthy();
    });

    it('handles multiple rules', () => {
        const schema: unknown = {
            type: 'object',
            properties: {
                object1: {
                    type: 'object',
                    properties: {
                        field1: {
                            type: 'string',
                            isNotBlank: true,
                            format: 'email'
                        }
                    },
                    required: ['field1']
                }
            },
            required: ['object1']
        };

        const result2 = validate({ object1: { field1: '' }}, schema);
        expect(result2.valid).toBeFalsy();
        expect(result2.errors).toBeTruthy();
        expect(result2.errors['object1.field1'].failed).toBeTruthy();
        expect(result2.errors['object1.field1'].failed.isNotBlank).toBeTruthy();
        expect(result2.errors['object1.field1'].failed.format).toBeTruthy();
    });

});
