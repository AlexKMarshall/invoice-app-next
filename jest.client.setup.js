import '@testing-library/jest-dom'
import 'whatwg-fetch'
import 'jest-extended'
import '@vanilla-extract/css/disableRuntimeStyles'

import { server } from './src/client/test/mocks/server'

beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})
afterEach(() => {
  server.resetHandlers()
})
