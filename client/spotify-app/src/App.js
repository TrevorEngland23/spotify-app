import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login'
import Dashboard from './Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';



const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return code ? <Dashboard code={code} /> : <Login />
}

export default App;
