import React, { useState } from "react"
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';

import './scss/app.scss';

import Home from './pages/Home'
import NotFound from "./components/NotFoundBlock";
import Cart from './pages/Cart';

export const SearchContext = React.createContext('');

function App() {
  const [search, setSearchValue] = useState('')
  
  return (
    <div className="wrapper">
       <SearchContext.Provider value={{search, setSearchValue}}>
          <Header />
          <div className="content">
            <div className="container">
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="*" element={<NotFound/>}/>
              </Routes>
            </div>
          </div>
       </SearchContext.Provider>
  </div>
  );
}

export default App;
