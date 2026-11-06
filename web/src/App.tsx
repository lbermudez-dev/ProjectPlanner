import { Route, Routes } from 'react-router'

function Home() {
  return <h1>ProjectPlanner</h1>
}

function NotFound() {
  return <p>Página no encontrada</p>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
