import { useEffect, useState } from "react"
import Home from "./pages/Home"
import AnimeItem from "./pages/AnimeItem"
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Search from "./pages/Search"

function App() {
  const [anime,setAnime] = useState()

  async function goRandom(navigate){
    try{
      const response=await fetch('https://ani-rand-server.vercel.app/random')
      const result = await response.json()
      if(response.ok){
        navigate('/animeItem',{state:{data:result.data.data,isRand:true}})
      }
        console.log(result)
    }catch(err){
      console.error(err)
    }
  }

  //https://anirand-backend.onrender.com

  async function getData(pageNo){
    try{
      const response = await fetch(`https://ani-rand-server.vercel.app?page=${pageNo}`)
      const data = await response.json()
      console.log(data)
      if(response.ok){
        setAnime(data)
        window.scrollTo(0,0)
        return
      }
    }catch(err){
      console.log(err)
      getData()
    }
  }

  useEffect(()=>{
    getData(1)
  },[])

  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home getData={getData} anime={anime} goRandom={goRandom}/>}/>
          <Route path="/animeItem" element={<AnimeItem anime={anime} setAnime={setAnime}/>}/>
          <Route path="/search" element={<Search />}/>
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
