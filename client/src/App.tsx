import { Route, Routes, Link } from 'react-router-dom';
import SurveyForm from './pages/SurveyForm';
import SurveyResults from './pages/SurveyResults';

function App() {
  return (
    <div className="container">
      <nav>
        <Link to="/">Fill Out Survey</Link> |{' '}
        <Link to="/results">View Survey Results</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SurveyForm />} />
        <Route path="/results" element={<SurveyResults />} />
      </Routes>
    </div>
  );
}

export default App;
