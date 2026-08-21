import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { api } from './axios'
import { useAuthStore } from '../store/useAuthStore'

describe('Auth Interceptor', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: 'old-token',
      refreshToken: 'valid-refresh-token',
    })
  })

  it('should attach the bearer token to requests', async () => {
    // We can't easily test the interceptor array if it's internal to axios without mocking complex internals,
    // so let's mock axios on a mock server or just use the interceptor directly if we exported it.
    // However, axios instances store interceptors in `handlers`.
    const requestInterceptor = (api.interceptors.request as any).handlers[0].fulfilled
    
    const config = { headers: {} as any }
    const result = requestInterceptor(config)
    
    expect(result.headers.Authorization).toBe('Bearer old-token')
  })

  it('should attempt refresh on 401', async () => {
    const responseInterceptorError = (api.interceptors.response as any).handlers[0].rejected
    
    const errorMock = {
      response: { status: 401 },
      config: { _retry: false, headers: {} },
    }

    const postSpy = vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: { token: 'new-access-token', refreshToken: 'new-refresh-token' }
    })
    
    // Replace api temporarily
    const apiMock = vi.fn().mockResolvedValue('retried-request')
    const originalApi = Object.assign({}, api)
    Object.assign(api, apiMock)
    Object.setPrototypeOf(api, Function.prototype)

    try {
      await responseInterceptorError(errorMock)
    } catch (e) {
      // ignore
    }

    expect(postSpy).toHaveBeenCalledWith('https://dummyjson.com/auth/refresh', {
      refreshToken: 'valid-refresh-token',
      expiresInMins: 30,
    })
    
    postSpy.mockRestore()
    Object.assign(api, originalApi)
  })
})
