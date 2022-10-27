/* eslint-disable @typescript-eslint/no-explicit-any */
import { before } from '@requisite/utils/lib/lang/ObjectUtils';
import { Model, Sequelize } from 'sequelize';
import { ConflictError, NotFoundError, SystemError } from '../../util/ApiErrors';
import { getLogger } from '../../util/Logger';

const sqlzLogger = getLogger('sqlz');

export function enableFindIncludeOptions(
    dataModel: typeof Model, getIncludes: () => unknown
): void {
    const model = dataModel as unknown as Record<string, () => unknown>;
    const advice = (...args: any[]) => {
        const inputs: any[] = args.map(arg => arg); // this is absolutely ridiculous
        const include = getIncludes();
        switch (true) {
            case (inputs.length === 0):
                inputs.push({ include });
                break;
            case (inputs.length === 1):
                if (typeof inputs[0] === 'number') {
                    inputs.push({ include });
                } else {
                    inputs[0].include = include;
                }
                break;
            case (inputs.length > 1):
                inputs[inputs.length - 1].include = include;
                break;
        }
        return inputs;
    };
    before(model, 'findAll', advice);
    before(model, 'findOne', advice);
    before(model, 'findByPk', advice);
}

export function enableCreateUpdateDataModelTransformation(
    dataModel: typeof Model, transformer: (data: any) => unknown
): void {
    const model = dataModel as unknown as Record<string, () => unknown>;
    const advice = (...args: any) => {
        const [ data, options ] =
            args.map((arg: any) => arg); // this is absolutely ridiculous
        return [ transformer(data), options ];
    };
    before(model, 'create', advice);
    before(model, 'update', advice);
}

export function enableDataModelLogging(dataModel: typeof Model): void {
    const model = dataModel as unknown as Record<string, () => unknown>;
    before(model, 'init', logInitSqlzAction);
    before(model, 'sync', logSyncSqlzAction);
    before(model, 'findAll', logFindAllSqlzAction);
    before(model, 'findOne', logFindOneSqlzAction);
    before(model, 'findByPk', logFindByPkSqlzAction);
    before(model, 'create', logCreateSqlzAction);
    before(model, 'update', logUpdateSqlzAction);
    before(model, 'destroy', logDestroySqlzAction);
}

function logInitSqlzAction(...args: unknown[]) {
    sqlzLogger.debug('Initializing data model: ', {
        model: this,
        table: (args[1] as Record<string, unknown>)['tableName']
    });
}

function logSyncSqlzAction() {
    sqlzLogger.info('Syncing tables for data model: ', this);
}

function logFindAllSqlzAction() {
    sqlzLogger.debug('Find all records for data model: ', { model: this });
}

function logFindOneSqlzAction(...args: unknown[]) {
    sqlzLogger.debug('Find one record for data model: ', { model: this, args });
}

function logFindByPkSqlzAction(...args: unknown[]) {
    sqlzLogger.debug('Find record by pk for data model: ', { model: this, args });
}

function logCreateSqlzAction(...args: unknown[]) {
    sqlzLogger.debug('Create record for data model: ', { model: this, args: JSON.stringify(args) });
}

function logUpdateSqlzAction(...args: unknown[]) {
    sqlzLogger.debug('Update record for data model: ', { model: this, args: JSON.stringify(args) });
}

function logDestroySqlzAction(...args: unknown[]) {
    sqlzLogger.debug('Destroy record for data model: ', { model: this, args: JSON.stringify(args) });
}

let sqlzInstance: Sequelize = null;

export async function getSequelize(): Promise<Sequelize> {
    const { API_DB_CONNECTION_URL } = process.env;
    if (!sqlzInstance) {
        sqlzInstance = new Sequelize(API_DB_CONNECTION_URL, {
            benchmark: true,
            logQueryParameters: true,
            logging: (sql, timeMs) => sqlzLogger.trace(sql, `Executed in: ${timeMs}ms`),
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
        await sqlzInstance.authenticate(); // test the connection
    }
    return sqlzInstance;
}

export function getDataGettersAndSetters(field: string): Record<string, unknown> {
    return {
        get() {
            return this.get('data')[field];
        },
        set(value: string) {
            const data = this.get('data') || {};
            data[field] = value;
            this.setDataValue('data', data);
        }
    };
}

export async function runWithSequelize<T>(
    callback: (sqlz: Sequelize) => Promise<T>
): Promise<T> {
    let sqlz;
    try {
        sqlz = await getSequelize();
    } catch(error) {
        throw new SystemError(error);
    }
    try {
        return await callback(sqlz);
    } catch (error) {
        switch(error.name) {
            case 'SequelizeUniqueConstraintError':
                // eslint-disable-next-line no-case-declarations
                const uniqueConstraintErr = error as unknown as Record<string, unknown>;
                throw new ConflictError(uniqueConstraintErr.fields ?
                    Object.keys(uniqueConstraintErr.fields).join(', ') :
                    'unknown'
                );
            case 'SequelizeForeignKeyConstraintError':
                // eslint-disable-next-line no-case-declarations
                const foreignConstraintErr = error as unknown as Record<string, unknown>;
                throw new NotFoundError(foreignConstraintErr.constraint ?
                    (foreignConstraintErr.constraint as string).split('_')[1] :
                    'unknown'
                );
            default:
                sqlzLogger.warn('Unexpected error encountered executing sequelize command', error);
                throw new SystemError(error);
        }
    }
}
