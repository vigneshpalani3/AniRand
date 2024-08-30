import { useRef, useState } from "react"
import { CiSearch } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom"
import AnimeTile from "../components/AnimeTile";
import { HiOutlineArrowSmallLeft, HiOutlineArrowSmallRight } from "react-icons/hi2";
import { CgHome } from "react-icons/cg";

function Search(){

    const location = useLocation()
    const {data} = location.state
    const navigate = useNavigate()
    const pageRef = useRef(1)
    const [input,setInput] = useState(location.state.input)

    async function handleInput(newItem){
        try{
            console.log('working')
            if(newItem) pageRef.current=1
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${input}&page=${newItem?1:pageRef.current}`)
            const data = await response.json()
            if(response.ok) return navigate('/search',{state:{data}}) 
            console.log(data)
        }catch(err){
            console.log(err)
        }
    }

    function handlePage(type){
        if(type==='next') pageRef.current+=1
        if(type==='prev') pageRef.current-=1
        handleInput(false)
    }

    return (
        <>
            <button className="go-home" onClick={()=>navigate('/')}><CgHome className="home-icon"/> Go Home</button>
            <div className="search-bar">
                <input type="text" placeholder="Naruto,One Piece,Bleach . . ." value={input} onChange={(e)=>setInput(e.target.value)}/>
                <button onClick={()=>handleInput(true)}><CiSearch className="search-icon"/></button>
            </div>
            <div className="home__anime-list">
                {
                    data&&(
                        data.data.map(item=>(
                            <AnimeTile item={item} key={item.mal_id}/>
                        ))
                    )
                }
            </div>
            <div className="page-btns">
                {pageRef.current>1&&<button onClick={()=>handlePage('prev')}><HiOutlineArrowSmallLeft className="arrows"/></button>}
                {data.pagination.has_next_page&&<button onClick={()=>handlePage('next')}><HiOutlineArrowSmallRight className="arrows"/></button>}
            </div>
        </>
    )
}

export default Search