import { createSlice } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'searched',
  initialState: {
    search: ''
  },
  reducers: {
    searchFilter: (state, action) => {
      state.search = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { searchFilter} = searchSlice.actions  

export const searchReducer =  searchSlice.reducer