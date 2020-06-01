import React from 'react'
import '../css/searchresults.css'
import axios from 'axios'
import { searchCover} from '../api/MusicAPI'
import Image from './Image'
import SVG from './SVG'

class SeeMore extends React.Component{

    constructor(props){
        super(props)
        this.instance = axios.create({
            baseURL: 'http://musicbrainz.org/ws/2/',
            });
        this.state = {
            cover : [],
            error : "",
        }
    }

    componentDidMount = () => {
        
        if(this.props.releases){
            let data = {"album" : this.props.releases,
        "cover" : [], "error" : "" }
            searchCover(data, 0, []).then((res)=>{
                if(res && res.cover.length !== 0){
                    this.setState({
                        cover : res.cover
                    })
                }else{
                    this.setState({
                        error : "Aucun cover n'a été trouvé."})
                }
            })
        }
    }

        
        


    render(){
        const {duration, artists, recordings    , releases, rating, genres} = this.props
        const {cover, error} = this.state
        let star = []
        for(let i=0; i< Math.round(rating);i++){
            star.push(<span>&#x2605;</span>)
        }
        let whiteStar = []
        for(let i=0; i< 5-Math.round(rating);i++){
            whiteStar.push(<span>&#x2606;</span>)
        }

        return(
            
            <div className="seeMore" >
                <h2>Informations</h2>
                <div>
                    <p><strong>Titre </strong>: {recordings  ? recordings     : ""}</p>
                    <p><strong>Artiste(s)</strong> : {artists ? artists.map((m)=>m.name+ " / "): "" }</p>
                    <p><strong>Genres</strong> : {genres ? genres.map((m)=>m.name+ " / "): ""}</p>
                    <p><strong>Album(s)</strong> : {releases ? releases.map((m)=>m.title+ " / "): "Aucun Album trouvé" }</p>
                    <p><strong>Durée</strong> : {duration ? duration : ""} </p>
                    <p><strong>Note </strong> : {rating?(<em>{star}{whiteStar}</em>): 'Aucune note trouvée'}</p>
                </div>
                
                    <h2>Covert Art </h2>
                <div className="covers">
                {error ? (<p className="text-center">{error}</p>) : (
                cover && cover.length !== 0 ? cover.map((m, i)=> <Image key={i} {...m} alt="Cover d'album" /> ) : ( <SVG color="#656d74"/>) 
                ) }
                
                </div>

            </div>
            

        )
    }
}

export default SeeMore