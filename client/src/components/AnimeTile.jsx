import {useNavigate} from 'react-router-dom'
import { PiArrowRight } from "react-icons/pi";

function AnimeTile({item}){

    const navigate = useNavigate()

    return (
        <>
        <div className="anime-item">
            <img src={item.images.webp.image_url} alt="" />
            <div className="details">
                <h1 className="title-eng">{item.title_english}</h1>
                <h2 className="title-jpn">{item.title}</h2>
                <div className="type">{item.type}</div>
                {item.score&&(
                    <div className="score">{item.score}/10</div>)
                }
                <button  onClick={()=>{
            navigate('/animeItem',{state:{data:item}})
        }}><PiArrowRight className='tile_arrow'/></button>
            </div>
        </div>
        </>
    )
}

export default AnimeTile