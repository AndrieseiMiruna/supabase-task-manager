import './App.css';
import TaskManagement from './components/TaskManagement';
import { Auth } from './components/Auth';

function App() {
  return (
    <div className="App">
      <Auth />
      <TaskManagement />
    </div>
  );
}

export default App;
