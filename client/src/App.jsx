import { useEffect, useState } from "react"
import Home from "./pages/Home"
import AnimeItem from "./pages/AnimeItem"
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Search from "./pages/Search"

function App() {
  const [anime,setAnime] = useState()

  function goRandom(navigate){
    if(!anime) return
    const randomIndex = Math.floor(Math.random()*anime.length)
    navigate('/animeItem',{state:{data:anime[randomIndex].data}})
  }

  async function getData(){
    try{
      const response = await fetch('https://anirand-backend.onrender.com')
      const data = await response.json()
      if(response.ok) return setAnime(data)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getData()
  },[])

  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home anime={anime} goRandom={goRandom}/>}/>
          <Route path="/animeItem" element={<AnimeItem anime={anime} setAnime={setAnime}/>}/>
          <Route path="/search" element={<Search />}/>
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
