export const isNullOrUndefined = (value: any): value is null | undefined => value === null || value === undefined

export const isNull = (value: any): value is null => value === null

export const isUndefined = (value: any): value is undefined => value === undefined

export const isString = (value: any): value is string => typeof value === 'string'

export const isValidNumber = (value: any): value is number => typeof value === 'number' && !Number.isNaN(value)

