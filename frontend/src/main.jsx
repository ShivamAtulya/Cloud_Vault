
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import './index.css'
import App from './App.jsx'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-north-1_Pff6kPSTt',
      userPoolClientId: 'u05sppoj7nrq1hbiuvp1nnfrc',
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
