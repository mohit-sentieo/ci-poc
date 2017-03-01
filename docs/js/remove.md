## Removing `redux-logic`

**We don't recommend removing `redux-logic`**, as we strongly feel that it's the
way to go for most redux based applications.

If you really want to get rid of it, you will have to delete its traces from several places.

**app/store.js**

1. Remove statement `import { createLogicMiddleware } from 'redux-logic'`.
2. Remove statement `const logicMiddleware = createLogicMiddleware([], injectedHelpers);`.
3. Remove `logicMiddleware` from `middlewares` array.
4. Remove statement `store.logicMiddleware = logicMiddleware;`

**app/utils/asyncInjectors.js**

1. Remove `logicMiddleware: isFunction,` from `shape`.
2. Remove function `injectAsyncLogic`.
3. Do not export `injectLogic: injectAsyncLogic(store, true)`.

**app/routes.js**

1. Do not pull out `injectLogic` from `getAsyncInjectors()`.
2. Remove `System.import('containers/HomePage/logic'),`
3. Remove `logic` from `importModules.then()`.
4. Remove `injectLogic(logic.default);` from every route that uses logic.

**Finally, remove it from the `package.json`. Then you should be good to go with whatever
side-effect management library you want to use!**

## Removing `reselect`

To remove `reselect`, remove it from your dependencies in `package.json` and then write
your `mapStateToProps` functions like you normally would!

You'll also need to hook up the history directly to the store. Make changes to `app/app.js`.

1. Remove statement `import { makeSelectLocationState } from 'containers/App/selectors'`
2. Make necessary changes to `history` as follows:

```js

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: makeSelectLocationState(),
});
```
