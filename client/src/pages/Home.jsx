import { useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import AnimeTile from "../components/AnimeTile";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowSmallLeft, HiOutlineArrowSmallRight } from "react-icons/hi2";

const Home = ({anime,goRandom,getData}) =>{
    const navigate = useNavigate()
    const [input,setInput] = useState('')
    const homePageRef = useRef(1)

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
                    anime?.data?.length?(
                        anime?.data?.map(item=>(
                            <AnimeTile item={item.data} key={item._id}/>
                        ))
                    ):(
                        <div className="no-items">
                            No item in the list
                        </div>
                    )
                }
            </div>{
                anime?.data&&(
                <div className="home__page-btns">
                    {homePageRef.current>1 && <button onClick={()=>{
                        homePageRef.current-=1
                        getData(homePageRef.current)
                        }}><HiOutlineArrowSmallLeft className="arrows"/></button>}
                    {anime?.pagination?.hasNextPage&&<button onClick={()=>{
                        homePageRef.current+=1
                        getData(homePageRef.current)
                        }}><HiOutlineArrowSmallRight className="arrows"/></button>}
                </div>
                )
            }
            <button className="go-random-btn" onClick={()=>goRandom(navigate)}>Go Random</button>
        </>
    )
}

export default Home
