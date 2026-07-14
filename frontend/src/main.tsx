import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/patrick-hand/400.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/700.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/paper.css'
import './styles/motion.css'
import './styles/sections.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
