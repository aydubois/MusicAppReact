import React from 'react'
import '../css/search.css'
import {search} from '../api/MusicAPI'
import axios from 'axios'

class Search extends React.Component{
    
    constructor(props){
        super(props)
        this.state= {
            searchBy : "",
            error : "",
            artist : "", 
            releases : [],
            wordSearch : "",
            cancelToken : ""
        }
        this.intermediateData = []
        this.instance = axios.create({
            baseURL: 'http://musicbrainz.org/ws/2/',
            });
        // this.inputSubmit = createRef()
        this.inputSubmit = this.props.forwardRef
    }

    searchMusicBaby = (e) => {
        e.preventDefault()
        if(this.state.cancelToken){
            this.state.cancelToken.cancel()
        }
        let wordSearch = e.target[0].value
        let searchByWhat = e.target[1].value
        var source = axios.CancelToken.source();
        
        searchByWhat ? this.setState({
            searchBy : searchByWhat, 
            cancelToken : source
        }, ()=>{this.verifSearchOK(wordSearch)})
        : this.setState({searchBy:"All"})

    }

    verifSearchOK = (wordSearch) => {
        
        if(!wordSearch){
            this.setState({error: "Veuillez taper votre recherche dans la barre ci-dessus"})
        }
        else{
            this.props.sendResults([],[], {"search" : "en cours"})
            
            search(wordSearch, this.instance, this.state.searchBy, this.state.cancelToken, parseInt(this.props.paginationStep)).then(data => {
                
                    if(data && data.count !== 0){
                        let dataPagination = {
                            offset : parseInt(this.props.paginationStep),
                            instance : this.instance,
                            count : data.count,
                            wordSearch : wordSearch,
                            type : this.state.searchBy,
                            cancelToken : this.state.cancelToken
                        }
                        this.props.sendResults(data,dataPagination, {"search" : "en cours"})
                    }else{
                        this.props.sendResults("error", [],{"search" : ""})
                    }
            })
            
            //remise à zéro pour la prochaine recherche
            this.setState({
                error:"", 
            })
        }
    }

    simulateClick = (e) => {
        if(e.keyCode === 13){
            this.inputSubmit.current.click()
        }
    }

    componentDidMount(){
        this.nameInput.focus()
    }

    render(){
        return (
            <section className="searchBar">
                <form onSubmit={this.searchMusicBaby}>
                    
                    <input ref={(input) => { this.nameInput = input; }} onKeyUp={this.simulateClick} type="text" placeholder="Ecris le nom d'un artiste, d'un titre ou d'un album"/>
                    <div>
                        <label htmlFor="selectSearchBy">Rechercher par : </label>
                        <select onKeyUp={this.simulateClick} name="selectSearchBy" id="selectSearchBy">
                            <option value="All" defaultValue>Tous</option>
                            <option value="artist">Artiste</option>
                            <option value="recording">Titre</option>
                            <option value="release">Album</option>
                        </select>
                    </div>
                    <input type='submit' ref={this.inputSubmit} value="Rechercher" />
                </form>
                        <p className="errors">{this.state.error}</p>
            </section>
        )
    }
}

export default Search;
