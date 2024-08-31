import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { CiCalendar } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

function AnimeItem({anime,setAnime}){
    const location = useLocation()
    const [item,setItem] = useState()
    const [isShrink,setIsShrink] = useState(true)
    const [isSelected,setIsSelected] = useState(false)
    const [id,setId] = useState()
    useEffect(()=>{
        const {data} = location.state
        console.log(data)
        setItem(data)
    },[])
    
    useEffect(()=>{
        checkIsSelected()
    },[item])

    function checkIsSelected(){
        console.log('checking')
        if(!anime?.length) return
        const match =anime?.find(animeItem=>animeItem?.data?.mal_id===item?.mal_id)
        console.log(match)
        if(match){
            console.log('yes')
            setIsSelected(true)
            setId(match._id)
            return
        }
        setIsSelected(false)
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
            const response = await fetch('https://anirand-backend.onrender.com',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    data:item
                })
            })

            const result = await response.json()
            console.log(result)
            if(response.ok){
                const newItem={
                    data:item,
                    _id:result.itemId
                }
                const newList=[...anime,newItem]
                setAnime(newList)
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
            const response = await fetch(`https://anirand-backend.onrender.com/${id}`,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            if(response.ok){
                console.log(anime[0])
                const rest = anime.filter(animeItem=>animeItem.data.mal_id!==item.mal_id)
                console.log(rest)
                setAnime(rest)
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
                            <iframe src={item.trailer.embed_url}></iframe>
                        </div>
)
                    }
                    <button onClick={handleActions} className={`action-btn ${isSelected?'del':'add'}`}>{isSelected?'Remove From List':'Add To List'}</button>
                </div>
            )
        }
        </>
    )
}

export default AnimeItem
