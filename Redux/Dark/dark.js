import { createSlice } from '@reduxjs/toolkit'

export const toggleSlice = createSlice({
  name: 'dark',
  initialState: {
    mode: false
  },
  reducers: {
    toggleMode: (state) => {
      state.mode = !state.mode
    }
  }
})

// Action creators are generated for each case reducer function
export const { toggleMode} = toggleSlice.actions  

export const toggleReduce =  toggleSlice.reducer