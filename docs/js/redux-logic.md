# `redux-logic`

"One place for all your business logic and action side effects"
Redux middleware that can:

 - **intercept** (validate/transform/augment) actions AND
 - **perform async processing** (fetching, I/O, side effects)

With redux-logic, you have the freedom to write your logic in your favorite JS style:

 - plain **callback** code - dispatch(resultAction)
 - **promises** - return axios.get(url).then(...)
 - **async/await** - result = await fetch(url)
 - **observables** - ob$.next(action1)

Use the type of code you and your team are comfortable and experienced with.

Leverage powerful **declarative** features by simply setting properties:

 - **filtering** for action type(s) or with regular expression(s)
 - **cancellation** on receiving action type(s)
 - use only response for the **latest** request
 - **debouncing**
 - **throttling**
 - dispatch actions - auto **decoration** of payloads

Testing your logic is straight forward and simple.

With simple code your logic can:

 - intercept actions before they hit the reducer
   - validate, verify, auth check actions and allow/reject or modify actions
   - transform - augment/enhance/modify actions
 - process - async processing and dispatching, orchestration, I/O (ajax, REST, subscriptions, GraphQL, web sockets, ...)

Redux-logic makes it easy to use code that is split into bundles, so you can dynamically load logic right along with your split UI.

Server rendering is simplified with redux-logic since it lets you know when all your async fetching is complete without manual tracking.

Inspired by redux-observable epics, redux-saga, and custom redux middleware, redux-logic combines ideas of each into a simple easy to use API.

Learn more about [redux-logic at its site](https://github.com/jeffbski/redux-logic)

## Usage

Logic is associated with a container, just like actions, constants, selectors and reducers. If your container already has a `logic.js` file, simply add your logic to that and make sure it is exported in the default array at the bottom. If your container does not yet have a `logic.js` file, add one with this boilerplate structure:

```JS
import { createLogic } from 'redux-logic';

// short example
export const fetchRepoLogic = createLogic({
  type: FETCH_REPO, // for this action type

  // implementing the async processing hook - process
  process({ getState, action, requestUil }), dispatch, done) {
    const id = action.payload;
    const url = `https://yourserver/repos/${id}`;
    requestUtil(url)
      .then(repo => dispatch({ type: FETCH_REPO_SUCCESS, payload: repo }))
      .catch(err => {
        console.error(err); // in case of render err
        dispatch({ type: FETCH_REPO_ERROR, payload: err, error: true });
      })
      .then(() => done()); // call when done dispatching
  }
});


// full examples with optional features
export const fooLogic = createLogic({
  type: 'FOO', // action type logic listens for
  // cancelType: 'BAR', // actions to cancel on
  // latest: true, // use response for latest request only
  /* other less used options: debounce, throttle */

  /*
    optionally implement either of these intercepting
    life-cycle hooks (validate or transform). The action
    passed through allow/reject/next is passed to next
    middleware or the reducers.
   */
  // validate({ getState, action }, allow, reject) {
  //   /* allow causes process hook to run, while
  //      reject prevents process hook from running
  //      In either case you can pass modified action
  //      or undefined to silence the action */
  //   allow(action); // or reject(action);
  // },
  //
  // transform({ getState, action }, next) {
  //   /* can pass modified action or undefined to silence action */
  //   next(action);
  // },

  /*
    optionally implement the process hook for async processing
    dispatch as necessary, call done when finished dispatching
    Implement with callbacks using dispatch/done OR
    implement returning promises or observables (shown later).
    `requestUtil` is the helper from `utils/request`
   */
  // dispatch/done callback style process use
  process({ getState, action, requestUtil }, dispatch, done) {
    // do async processing here
    // dispatch({ type: 'CAT' }); // dispatch thing(s)
    done();
  },

  /* OR using the auto-dispatching return style by omitting dispatch/done
     Omit dispatch & done in signature and just return a value
      - if you return an undefined then no dispatch will occur
      - if you return an object it will be dispatched
      - if you return a promise then dispatch the resolved/rejected action
      - if you return an observable then dispatch next/error actions
      - if you return an error it will be dispatched (wrapped first if action type)
     Then you can write code like the following. See docs for more details.

     processOptions: { // influences what is dispatched
       // successType: FOO_SUCCESS, // apply action type/creator for success
       failType: FOO_ERROR // apply action type/creator on errors
     },

     process({ getState, action, requestUtil }) {
       // return promise that resolves to the action to dispatch,
       // I am showing how to resolve to the action I want to dispatch,
       // but I also could have enabled the processOptions.successType
       // and just resolved with repos for the same dispatch.
       return API.fetchRepos(action.payload)
         .then(repos => ({ type: FOO_SUCCESS, payload: repos }));
     }
  */
});

// Your logic for this container
export default [
  fetchRepoLogic,
  fooLogic
];
```

Then, in your `routes.js`, add injection for the newly added logic:

```JS
getComponent(nextState, cb) {
  const importModules = Promise.all([
    System.import('containers/YourComponent/reducer'),
    System.import('containers/YourComponent/logic'),
    System.import('containers/YourComponent'),
  ]);

  const renderRoute = loadModule(cb);

  importModules.then(([reducer, logic, component]) => {
    injectReducer('home', reducer.default);
    injectLogic(logic.default); // Inject the logic

    renderRoute(component);
  });

  importModules.catch(errorLoading);
},
```

Now add as much logic to your `logic.js` file as you want!
