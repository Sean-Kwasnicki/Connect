import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import serverReducer from "./server";
import channelReducer from "./channel";
import messageReducer from "./message";
import reactionReducer from "./reaction";
import directMessagesReducer from "./directmessages";

const rootReducer = combineReducers({
  session: sessionReducer,
  servers: serverReducer,
  channels: channelReducer,
  messages: messageReducer,
  reactions: reactionReducer,
  directMessages: directMessagesReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
