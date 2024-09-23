import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { CiCalendar } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

function AnimeItem({anime,setAnime}){
    const location = useLocation()
    const [item,setItem] = useState(location.state.data)
    const [isShrink,setIsShrink] = useState(true)
    const [isSelected,setIsSelected] = useState(false)
    const [id,setId] = useState()
    
    useEffect(()=>{
        if(item) checkIsSelected()
    },[item])

    async function checkIsSelected(){
        try{
            const response = await fetch(`https://ani-rand-server.vercel.app/check/${item.mal_id}`)
            const result= await response.json()
            console.log(result)
            if(response.ok && result.isExist){
                setId(result.id)
                setIsSelected(true)
                return
            }
            setIsSelected(false)
        }catch(err){
            console.error(err)
        }
    }

    function handleActions(){
        console.log('working')
        if(isSelected) return removeItem()
        addItem()
    }

    useEffect(()=>{
        console.log('is selected :',isSelected)
    },[isSelected])

    async function addItem(){
        try{
            console.log('adding')
            const requestBody=JSON.stringify({
                    data:item
                })
            console.log(requestBody)
            const response = await fetch('https://ani-rand-server.vercel.app',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:requestBody
            })

            const result = await response.json()
            console.log(result)
            if(response.ok){
                setId(result.itemId)
                console.log('added')
                setIsSelected(true)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function removeItem(){
        try{
            console.log('removing')
            const response = await fetch(`https://ani-rand-server.vercel.app/${id}`,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            if(response.ok){
                console.log('removed')
                setIsSelected(false)
            }
        }catch(err){
            console.log(err)
        }
    }

    return (
        <>
        {
            item && (
                <div className="anime__info">
                    <div className="main-details">
                        <img src={item.images.webp.large_image_url} alt="" className="thumb" />
                        <div className="main-right">
                            <div className="main-title">{item.title_english}</div>
                            <div className="main-title-jpn">{item.title}</div>
                            <div className="aired"><CiCalendar className="date-icon"/>{item.aired.string}</div>
                            <div className="members"><CgProfile className="member-icon"/>{item.members.toLocaleString()}</div>
                            <div className="main-score">{item.score}/10</div>
                            {
                            item.genres.length&&(
                            <div className="genres">
                                {
                                    item.genres.map(genre=>(
                                        <div className="genre" key={genre.mal_id}>{genre.name}</div>
                                    ))
                                }
                            </div>
                        )
                            }
                        </div>
                    </div>
                    <div className="synopsis">
                        <h2>Synopsis</h2>
                        <p>{isShrink?item.synopsis.slice(0,400)+'...':item.synopsis}
                            <button className="read-more-btn" onClick={()=>{
                            setIsShrink(state=>!state)
                            }}>
                                {isShrink?'Read more':'Read less'}
                            </button>
                        </p>
                    </div>
                    { item.trailer.embed_url&&(
                        <div className="trailer">
                            <h2>Trailer</h2>
                            <iframe src={item.trailer.embed_url} allowFullScreen></iframe>
                        </div>
)
                    }
                    {
                        location.state.isRand||<button onClick={handleActions} className={`action-btn ${isSelected?'del':'add'}`}>{isSelected?'Remove From List':'Add To List'}</button>
                    }
                </div>
            )
        }
        </>
    )
}

export default AnimeItem
