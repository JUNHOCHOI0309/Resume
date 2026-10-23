import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Portfolio from './Portfolio'
import './styles.css'

const root = document.getElementById('app')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <Portfolio />
    </BrowserRouter>
  </StrictMode>
)
const currentPath = window.location.pathname.replace(/\/$/, '') || '/'
if (root.hasChildNodes() && root.dataset.route === currentPath) hydrateRoot(root, app)
else createRoot(root).render(app)
