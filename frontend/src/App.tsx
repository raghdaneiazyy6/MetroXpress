// src/App.tsx
import { Button } from "./components/ui/Button";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Smart Transport System
        </h1>
        <div className="space-x-4">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
