import { configureStore } from '@reduxjs/toolkit'
import { searchReducer } from './search/search'
import { toggleReduce } from './Dark/dark'

export const store =  configureStore({
  reducer: {
    searched : searchReducer,
    dark : toggleReduce
  }
})