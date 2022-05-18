import test from 'node:test';
import assert from 'node:assert'

const callTracker = new assert.CallTracker();
process.on('exit', () => callTracker.verify());

import { routes } from '../../../src/routes/heroRoute.js'
import { DEFAULT_HEADER } from '../../../src/util/util.js';

test('Hero routes - endpoints test suite', async (t) => {
  await t.test('it should call GET route', async () => {
    const databaseMock = [{"id":"97d0a1af-7a4a-4d6e-8023-812dd6101673","name":"Batman","age":50,"power":"rich"}];

    const heroServiceStub = {
      find: async () => databaseMock,
    }

    const endpoints = routes({ heroService: heroServiceStub });
    const getEndpoint = '/heroes:get';
    const request = {};
    const response = {
      write: callTracker.calls(item => {
        const expected = JSON.stringify({ results: databaseMock });
        assert.strictEqual(item, expected, 'write should be call with the correct payload')
      }),
      end: callTracker.calls(item => {
        assert.strictEqual(item, undefined, 'end should be call without params')
      })
    }
    await endpoints[getEndpoint](request, response)
  });



  // await t.test('it should call POST route', )
})