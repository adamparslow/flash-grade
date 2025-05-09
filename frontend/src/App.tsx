import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  async function getData() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/hello`);
    const json = response.body;
    console.log(json);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
