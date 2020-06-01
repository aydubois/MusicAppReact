import React from 'react'
import axios from 'axios'
import SVGSeeMore from './SVGSeeMore.js'
import {searchSeeMore} from '../api/MusicAPI'

import '../css/searchresults.css'
class OneResult extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            seeMore : false,
            titles : '',
            albums : [],
            artists : [],
            duration : 0,
        }

        this.instance = axios.create({
            baseURL: 'http://musicbrainz.org/ws/2/'
        });
    }

    /**
     * Calls the API query function that retrieves data from a single recording
     * Send the result to the modal
     */
    seeMore = () =>{
        searchSeeMore(this.props.id).then(
            (result)=> {
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
        )
    }


    render(){

        const {nbId, title, releases} = this.props
        const artist = this.props["artist-credit"][0].name
        
        return(
        
            <tr id={nbId+1}>
                <td >{nbId+1}</td>
                <td>{artist}</td>
                <td>{title}</td>
                <td>{releases ? releases[0].title : ""}</td>
                <td onClick={this.seeMore}><SVGSeeMore/></td>
            </tr>

        )
    }
}

export default OneResult