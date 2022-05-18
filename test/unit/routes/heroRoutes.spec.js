import test from 'node:test';
import assert from 'node:assert'
import { EventEmitter } from 'node:events'

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



  await t.todo('it should call POST route', async () => {
    const heroServiceStub = {
      create: async (hero) => hero.id,
    }

    const endpoints = routes({ heroService: heroServiceStub });
    const postEndpoint = '/heroes:post';
    const myEmitter = new EventEmitter();
    const data = {"id": "idTest", "name": "Italozinho", "age": 13, "power": "Minecraft"}
    const request = myEmitter.emit('data', {data});

    const response = {
      write: callTracker.calls(item => {
        const expected = JSON.stringify({
          id: "idTest",
          success: 'User created with success!!',
        });
        assert.strictEqual(JSON.stringify(item), expected, 'write should be call with the correct payload')
      }),
    }
    await endpoints[postEndpoint](request, response)
  });
})