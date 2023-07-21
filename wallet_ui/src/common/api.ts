import { APPLICATION_ENVS } from '../constants'

export const buildApiUrl = (path: string) => {
  let baseUrl = APPLICATION_ENVS.API_URL
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1)
  }

  if (path.startsWith('/')) {
    path = path.substring(1)
  }

  return baseUrl + '/' + path
}
