/**
 * Test store addons
 */

import expect from 'expect';
import configureStore from '../store'; // eslint-disable-line
import { browserHistory } from 'react-router';

describe('configureStore', () => {
  let store;

  before(() => {
    store = configureStore({}, browserHistory);
  });

  describe('asyncReducers', () => {
    it('should contain an object for async reducers', () => {
      expect(typeof store.asyncReducers).toEqual('object');
    });
  });

  describe('store.logicMiddleware', () => {
    it('should contain logic middleware instance', () => {
      expect(typeof store.logicMiddleware).toEqual('function');
    });
  });
});
