import { Routes, Route } from 'react-router';
import AddBookMark from './components/AddBookMark';
import TagManager from './components/TagManager';
import Navigator from './components/Navigator';
import 'remixicon/fonts/remixicon.css'
import Categories from './components/Categories';

function App() {

  return (
    <>
      <Routes>
        <Route path="/"
        element={<Navigator/>}
        />
        <Route path='/adder' element={<AddBookMark/>}/>
        <Route path='/manager' element={<TagManager/>}/>
        <Route path='/tags' element={<Categories/>}/>
      </Routes>
    </>
  )
}

export default App
