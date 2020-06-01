import React from 'react'
import {search} from '../api/MusicAPI'
import '../css/searchresults.css'


class Pagination extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            offset : this.props.offset,
            hiddenNext : "next",
            hiddenPrevious : "previous"
        }
    }

    previousResults = (e) => {
        if(this.props.offset - parseInt(this.props.paginationStep) >= 0){

            this.props.sendResults([],[], {"search" : "en cours"})
            
            search(this.props.wordSearch, this.props.instance, this.props.type, this.props.cancelToken,this.props.paginationStep, (this.props.offset-(parseInt(this.props.paginationStep)*2))).then(data => {
                if(data && data.count !== 0){
                    let dataPagination = {
                        offset : this.props.offset-parseInt(this.props.paginationStep),
                        instance : this.props.instance,
                        count : data.count,
                        wordSearch : this.props.wordSearch,
                        type : this.props.type,
                        cancelToken : this.props.cancelToken
                    }
                    this.props.sendResults(data, dataPagination, {"search" : "en cours"})
                }else{
                    this.props.sendResults("error",[], {"search" : ""})
                }
            })
        }
    }
    nextResults = (e) => {
        if(this.props.offset < this.props.count){

            this.props.sendResults([],[], {"search" : "en cours"})
            
            search(this.props.wordSearch, this.props.instance, this.props.type, this.props.cancelToken,this.props.paginationStep, (this.props.offset)).then(data => {
                if(data && data.count !== 0){
                    let dataPagination = {
                        offset : this.props.offset+parseInt(this.props.paginationStep),
                        instance : this.props.instance,
                        count : data.count,
                        wordSearch : this.props.wordSearch,
                        type : this.props.type,
                        cancelToken : this.props.cancelToken
                    }
                    this.props.sendResults(data,dataPagination, {"search" : "en cours"})
                }else{
                    this.props.sendResults("error", [],{"search" : ""})
                }
            })
        }
    }
    componentDidMount = () => {
        if(this.props.offset - parseInt(this.props.paginationStep) <= 0){
            this.setState({
                hiddenPrevious : "hidden previous"
            })
        }else if(this.props.offset >= this.props.count){
            this.setState({
                hiddenNext :"hidden next"
            })
        }else {
            this.setState({
                hiddenNext : "next",
                hiddenPrevious : "previous"
            })
        }
    }
    render(){
        return(
        <div className="pagination">
            <button onClick={this.previousResults} className={this.state.hiddenPrevious}>Résultats précédents</button>
            <button  onClick={this.nextResults}  className={this.state.hiddenNext}>Résultats suivants</button>

        </div>
        )
    }
}

export default Pagination