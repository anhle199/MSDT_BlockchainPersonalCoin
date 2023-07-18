export const isNullOrUndefined = (value: any): value is null | undefined => value === null || value === undefined

export const isNull = (value: any): value is null => value === null

export const isUndefined = (value: any): value is undefined => value === undefined

export const isValidDateString = (value: string) => {
  const date = new Date(value)
  return !Number.isNaN(date.getTime())
}
