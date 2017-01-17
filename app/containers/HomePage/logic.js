/**
 * Gets the repositories of the user from Github
 */

import { createLogic } from 'redux-logic';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_REPOS } from 'containers/App/constants';
import { reposLoaded, repoLoadingError } from 'containers/App/actions';
import { selectUsername } from 'containers/HomePage/selectors';

/**
 * Github repos request/response handler
 */
export const getReposLogic = createLogic({
  type: LOAD_REPOS, // trigger on this action
  cancelType: LOCATION_CHANGE, // cancel if route changes
  latest: true, // use response for the latest request when multiple

  processOptions: { // options configuring the process hook below
    // on error/reject, automatically dispatch(repoLoadingError(err))
    failType: repoLoadingError, // action creator which accepts error
  },

  // perform async processing, Using redux-logic promise features
  // so it will dispatch the resolved action from the returned promise.
  // on error, it dispatches the using the action creator set in
  // processOptions.failType above `repoLoadingError(err)`
  // requestUtil was injected in store.js createLogicMiddleware
  process({ getState, requestUtil /* , action */ }) {
    const username = selectUsername()(getState());
    const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;
    return requestUtil(requestURL) // return a promise resolving to action
      .then((repos) => reposLoaded(repos, username)); // resolve w/action
  },
});


// Bootstrap logic
export default [
  getReposLogic,
];
