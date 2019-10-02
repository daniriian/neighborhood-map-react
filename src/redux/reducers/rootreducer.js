// A reducer is just a JavaScript function.
// A reducer takes two parameters: the current state and an action

const initialState = {
  places: [],
  placeListVisible: true,
  query: '',
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_PLACE_LIST': {
      const newState = {...state, placeListVisible: !state.placeListVisible};
      console.log('IUAN');
      return newState;
    }
    default:
      return state;
  }
};

export default rootReducer;
