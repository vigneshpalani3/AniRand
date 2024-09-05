import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import AnimeTile from "../components/AnimeTile";
import { useNavigate } from "react-router-dom";

const Home = ({anime,goRandom}) =>{
    const navigate = useNavigate()
    const [input,setInput] = useState('')
    useEffect(()=>{console.log(anime)},[anime])
    
    async function handleInput(){
        try{
            console.log('working')
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${input}`)
            const data = await response.json()
            if(response.ok) return navigate('/search',{state:{data,input}})
            console.log(data)
        }catch(err){
            console.log(err)
        }
    }

    return (
        <>
            <div className="search-bar">
                <input type="text" placeholder="Naruto,One Piece,Bleach . . ." value={input} onChange={(e)=>setInput(e.target.value)}/>
                <button onClick={handleInput}><CiSearch className="search-icon"/></button>
            </div>
            <div className="home__anime-list">
                {
                    anime?.length?(
                        anime?.map(item=>(
                            <AnimeTile item={item.data} key={item._id}/>
                        ))
                    ):(
                        <div className="no-items">
                            No item in the list
                        </div>
                    )
                }
            </div>
            <button className="go-random-btn" onClick={()=>goRandom(navigate)}>Go Random</button>
        </>
    )
}

export default Home
