import { useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';

function App() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      {isAdmin ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  );
}

export default App;
