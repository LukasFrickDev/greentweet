import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import Rotas from './routes'

import GlobalCss from './styles'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/lib/integration/react'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <GlobalCss />
          <Rotas />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
