import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';

//Componente que atua como um 'guarda de rota'
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Se não houver token, redireciona para a página de login
    return <Navigate to="/login" />;
  }
  //Se houver token, permite que o componente filho (Dashboard) seja renderizado
  return children;
};

function App() {
  return (
    <Router>
      <nav style = {{ marginBotton: '20px'}}>
        <Link to = "/">Home</Link> |
        <Link to = "/login">Login</Link> |
        <Link to = "/register">Registro</Link> |    {/* Link para a rota */}
        <Link to = "/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        {/* Rotas Públicas */}
        <Route path = "/" element = { <h2>Página Inicial</h2>} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/register" element = {<Register />} /> {/* Mapeamento da rota */}
        {/* Rota Protegida */}
        <Route
          path = "/dashboard"
          element = {
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;