import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './Pages/DashBoard';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
