import React from 'react'
import ReactDOM from 'react-dom/client'

const App = React.lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Suspense fallback={<h1>Cargando...</h1>}>
    <App />
  </React.Suspense>
)
