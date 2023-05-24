import kpRequest from '../core/index'

export function login(username: string, password: string) {
  return kpRequest.post({
    url: '/oauth/login',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      username: username,
      password: password
    }
  })
}
