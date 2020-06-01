import React from 'react'
import '../css/searchresults.css'
import axios from 'axios'
import {searchSeeMore} from '../api/MusicAPI'
import SVGSeeMore from './SVGSeeMore.js'
class OneResult extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            seeMore : false,
            titles : "",
            albums : [],
            artists : [],
            duration : 0,
        }
        this.instance = axios.create({
            baseURL: 'http://musicbrainz.org/ws/2/',
            // timeout: 1000,
            });
    }

    seeMore = () =>{
        searchSeeMore(this.props.id).then(
            (res)=> {
                this.update(res)
            }
        )
    }
   
    update = (result) => {
        let data = {
            'id': this.props.id, 
            'titles' : this.props.title,
            'albums' : result["album"],
            'artists' : result["artists"],
            'duration' : result["duree"],
            'rating' : result["rating"],
            'genres' : result["genres"],
            'cover' : result["cover"],
        }
        this.props.modalShow(data)
    }

    render(){
        const {nbId, title, releases} = this.props

        return(
            
                <tr id={nbId+1}>
                    <td >{nbId+1}</td>
                    <td>{this.props["artist-credit"][0].name}</td>
                    <td>{title}</td>
                    <td>{releases ? releases[0].title : ""}</td>
                    <td onClick={this.seeMore}><SVGSeeMore/></td>
                </tr>

        )
    }
}

export default OneResult