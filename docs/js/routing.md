# Routing via `react-router` and `react-router-redux`

`react-router` is the de-facto standard routing solution for react applications.
The thing is that with redux and a single state tree, the URL is part of that
state. `react-router-redux` takes care of synchronizing the location of our
application with the application state.

(See the [`react-router-redux` documentation](https://github.com/reactjs/react-router-redux)
for more information)

## Usage

To add a new route, use the generator with `npm run generate route`.

This is what a standard (generated) route looks like for a container:

```JS
{
  path: '/',
  name: 'home',
  getComponent(nextState, cb) {
    const importModules = Promise.all([
      import('containers/HomePage')
    ]);

    const renderRoute = loadModule(cb);

    importModules.then(([component]) => {
      renderRoute(component);
    });

    importModules.catch(errorLoading);
  },
}
```

To go to a new page use the `push` function by `react-router-redux`:

```JS
import { push } from 'react-router-redux';

dispatch(push('/some/page'));
```

## Child Routes
`npm run generate route` does not currently support automatically generating child routes if you need them, but they can be easily created manually.

For example, if you have a route called `about` at `/about` and want to make a child route called `team` at `/about/our-team` you can just add that child page to the parent page's `childRoutes` array like so:

```JS
/* your app's other routes would already be in this array */
{
  path: '/about',
  name: 'about',
  getComponent(nextState, cb) {
    const importModules = Promise.all([
      import('containers/AboutPage'),
    ]);

    const renderRoute = loadModule(cb);

    importModules.then(([component]) => {
      renderRoute(component);
    });

    importModules.catch(errorLoading);
  },
  childRoutes: [
    {
      path: '/about/our-team',
      name: 'team',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/TeamPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
  ]
}
```

## Index routes

To add an index route, use the following pattern:

```JS
{
  path: '/',
  name: 'home',
  getComponent(nextState, cb) {
    const importModules = Promise.all([
      import('containers/HomePage')
    ]);

    const renderRoute = loadModule(cb);

    importModules.then(([component]) => {
      renderRoute(component);
    });

    importModules.catch(errorLoading);
  },
  indexRoute: {
    getComponent(partialNextState, cb) {
      const importModules = Promise.all([
        import('containers/HomeView')
      ]);

      const renderRoute = loadModule(cb);

      importModules.then(([component]) => {
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
  },
}
```

## Dynamic routes

To go to a dynamic route such as 'post/:slug' eg 'post/cool-new-post', firstly add the route to your `routes.js`, as per documentation:

```JS
path: '/posts/:slug',
name: 'post',
getComponent(nextState, cb) {
 const importModules = Promise.all([
   import('containers/Post/reducer'),
   import('containers/Post/logic'),
   import('containers/Post'),
 ]);

 const renderRoute = loadModule(cb);

 importModules.then(([reducer, logic, component]) => {
   injectReducer('post', reducer.default);
   injectLogic(logic.default);
   renderRoute(component);
 });

 importModules.catch(errorLoading);
},
```

###Container:

```JSX
<Link to={`/posts/${post.slug}`} key={post._id}>
```

Clickable link with payload (you could use push if needed).

###Action:

```JS
export function getPost(slug) {
  return {
    type: LOAD_POST,
    slug,
  };
}

export function postLoaded(post) {
  return {
    type: LOAD_POST_SUCCESS,
    podcast,
  };
}
```

### Logic:

```JS
import { createLogic } from 'redux-logic';

// using process hook's dispatch/done callback style
const getXhrPodcastLogic = createLogic({
  type: LOAD_POST,
  process({ getState, action, requestUtil }, dispatch, done) {
    const { slug } = action;
    const requestURL = `http://your.api.com/api/posts/${slug}`;
    requestUtil(requestURL)
      .then(post => dispatch(postLoaded(post)))
      .catch(err => {
        console.error(err); // in case of render error
        dispatch(postLoadingError(post.err));
      })
      .then(() => done()); // call when done dispatching
  }
});
```

OR since redux-logic supports a nice API for promises, async/await, and observables where you simply return the value rather than using dispatch/done.
```js
import { createLogic } from 'redux-logic';
// using process hook's return dispatch style
const getXhrPodcastLogic = createLogic({
  type: LOAD_POST,
  processOptions: { // optional to influence dispatching
    successType: postLoaded, // apply this action creator on success
    failType: postLoadingError, // apply this action creator on error
  },
  // omitting dispatch/done makes process use the returned promise
  process({ getState, action, requestUtil }) {
    const { slug } = action.payload;
    const requestURL = `http://your.api.com/api/posts/${slug}`;
    return requestUtil(requestURL); // return promise with data
  }
});
```


This logic will listen for actions of type LOAD_POST and once it finds one it will use the `requestUtil` helper (which was injected in app/store.js in the createLogicMiddleware) which was already injected to be available to all logic instances. Use the `requestUtil` to fetch the content, returning a promise which resolves to the data.

In our first example using dispatch and one, we demonstrate writing redux-logic using a callback style code, calling dispatch when we want to dispatch and calling done when we are finished.

In the second exmple we are using the return dispatch signature by omitting the dispatch and done from the function. It will realize that the returned value is a promise and wait for its resolve/reject value which it will hand to our successType action creator or failType action creator to create the action and dispatch it. Using successType and failType are each optional to automatically create an action or use an action creator to wrap the data/error.

The dispatched action will go through redux middleware and down to the reducer where state is updated.
You can read more on [`react-router`'s documentation](https://github.com/reactjs/react-router/blob/master/docs/API.md#props-3).
