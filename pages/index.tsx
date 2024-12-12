import Home from './home';  // Import the Home component
import Dashboard from './dashboard';  // Import the Dashboard component

export default function IndexPage() {
  return (
    <div>
      <h1>Shopping List App</h1>
      <Home />  {/* Render the Home component */}
      <Dashboard />  {/* Render the Dashboard component */}
    </div>
  );
}
