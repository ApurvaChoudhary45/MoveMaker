'use client'; // Required for context components in App Router

import { Provider } from 'react-redux';
import { store } from './store';

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}