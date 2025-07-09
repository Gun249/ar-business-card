import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

// Create root element if it doesn't exist
let rootElement = document.getElementById("root")
if (!rootElement) {
  rootElement = document.createElement("div")
  rootElement.id = "root"
  document.body.appendChild(rootElement)
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
