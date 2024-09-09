import { createStore, combineReducers } from 'redux';


const rootReducer = combineReducers({
  profile: profileReducer
});

const store = createStore(rootReducer);

export default store;
 