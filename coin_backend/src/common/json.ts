export const safeStringifyJson = (value: any) => {
  try {
    return JSON.stringify(value)
  } catch {
    // TypeError
    return undefined
  }
}

export const safeParseJson = <Result = any>(value: string) => {
  try {
    return JSON.parse(value) as Result
  } catch {
    // SyntaxError
    return undefined
  }
}
