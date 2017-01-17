/**
 * Test async injectors
 */

import expect from 'expect';
import configureStore from 'store';
import { memoryHistory } from 'react-router';
import { createLogic } from 'redux-logic';
import { fromJS } from 'immutable';

import {
  injectAsyncReducer,
  injectAsyncLogic,
  getAsyncInjectors,
} from 'utils/asyncInjectors';

// Fixtures

const initialState = fromJS({ reduced: 'soon' });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TEST':
      return state.set('reduced', action.payload);
    default:
      return state;
  }
};

const testLogic = createLogic({
  type: 'TRIGGER_TEST',
  process() { // return action to dispatch
    return { type: 'TEST', payload: 'yup' };
  },
});

const logic = [
  testLogic,
];

describe('asyncInjectors', () => {
  describe('getAsyncInjectors', () => {
    let store;

    before(() => {
      store = configureStore({}, memoryHistory);
    });

    it('given a store, should return all async injectors', () => {
      const { injectReducer, injectLogic } = getAsyncInjectors(store);

      injectReducer('test', reducer);
      injectLogic(logic);

      store.dispatch({ type: 'TRIGGER_TEST' });
      const actual = store.getState().get('test');
      const expected = initialState.merge({ reduced: 'yup' });
      expect(actual.toJS()).toEqual(expected.toJS());
    });

    it('should throw if passed invalid store shape', () => {
      let result = false;

      Reflect.deleteProperty(store, 'dispatch');

      try {
        getAsyncInjectors(store);
      } catch (err) {
        result = err.name === 'Invariant Violation';
      }

      expect(result).toEqual(true);
    });
  });

  describe('helpers', () => {
    let store;

    before(() => {
      store = configureStore({}, memoryHistory);
    });

    describe('injectAsyncReducer', () => {
      it('given a store, it should provide a function to inject a reducer', () => {
        const injectReducer = injectAsyncReducer(store);

        injectReducer('test', reducer);

        const actual = store.getState().get('test');
        const expected = initialState;

        expect(actual.toJS()).toEqual(expected.toJS());
      });

      it('should throw if passed invalid name', () => {
        let result = false;

        const injectReducer = injectAsyncReducer(store);

        try {
          injectReducer('', reducer);
        } catch (err) {
          result = err.name === 'Invariant Violation';
        }

        try {
          injectReducer(999, reducer);
        } catch (err) {
          result = err.name === 'Invariant Violation';
        }

        expect(result).toEqual(true);
      });

      it('should throw if passed invalid reducer', () => {
        let result = false;

        const injectReducer = injectAsyncReducer(store);

        try {
          injectReducer('bad', 'nope');
        } catch (err) {
          result = err.name === 'Invariant Violation';
        }

        try {
          injectReducer('coolio', 12345);
        } catch (err) {
          result = err.name === 'Invariant Violation';
        }

        expect(result).toEqual(true);
      });
    });

    describe('injectAsyncLogic', () => {
      it('given a store, it should provide a function to inject logic', () => {
        const injectLogic = injectAsyncLogic(store);
        injectLogic(logic);

        store.dispatch({ type: 'TRIGGER_TEST' });
        const actual = store.getState().get('test');
        const expected = initialState.merge({ reduced: 'yup' });
        expect(actual.toJS()).toEqual(expected.toJS());
      });

      it('should throw if passed invalid logic', () => {
        let result = false;

        const injectLogic = injectAsyncLogic(store);

        try {
          injectLogic(false /* should be logic arr */);
        } catch (err) {
          result = err.name === 'Invariant Violation';
        }

        try {
          injectLogic(testLogic); // should be an array of logic
        } catch (err) {
          result = err.name === 'Invariant Violation';
        }

        expect(result).toEqual(true);
      });
    });
  });
});
