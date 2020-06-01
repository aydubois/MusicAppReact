import React, {createRef} from 'react'
import '../css/searchresults.css'
import OneResult from './OneResult.js'
import Pagination from './Pagination.js'
import {search} from '../api/MusicAPI'

import SVG from './SVG.js'
class SearchResults extends React.Component{

    constructor(props){
        super(props)
        console.log(props)
        this.refAnchor = createRef()
        this.refGoAnchor = createRef()
        this.inputSubmit = createRef();

        this.state ={
            valueAnchor : '#'
        }
    }
    
    goAnchor = (e) => {
        e.preventDefault()

        const {paginationActive, paginationStep,  wordSearch, instance, type, cancelToken, offset} = this.props
        let value = this.refAnchor.current.value


        if(paginationActive){
            if(value && (value >= offset || value <= offset-paginationStep) ){
                

                if(value%paginationStep !== 0){
                    console.log(value)
                    
                    value = Math.trunc(value / paginationStep) * paginationStep
                    console.log(value)
                }else{
                    value = value-1
                    value = Math.trunc(value / paginationStep) * paginationStep
                    
                }
                this.props.sendResults([],[], {"search" : "en cours"})
                
               
                search(wordSearch, instance, type, cancelToken,paginationStep, parseInt(value)).then(data => {
                if(data && data.count !== 0){
                    let dataPagination = {
                        offset : parseInt(value)+parseInt(paginationStep),
                        instance : instance,
                        count : data.count,
                        wordSearch : wordSearch,
                        type : type,
                        cancelToken : cancelToken
                    }
                    console.log(dataPagination)
                    this.props.sendResults(data, dataPagination, {"search" : "en cours"})
                }else{
                    this.props.sendResults("error",[], {"search" : ""})
                }
            })
            
            } else{ 
                if(this.refAnchor.current.value && this.refAnchor.current.value !== 0){
                    value = this.refAnchor.current.value-2
                }else{ value = ''}
                this.setState({ 
                    valueAnchor: '#'+value
                }, 
                this.refGoAnchor.current.click(),
                this.refAnchor.current.value = "",
                )
            }
        }else{
            if(this.refAnchor.current.value && this.refAnchor.current.value !== 0){
                value = this.refAnchor.current.value-2
            }else{ value = ''}

            this.setState({ valueAnchor: '#'+value}, 
            this.refGoAnchor.current.click(),
            this.refAnchor.current.value = "",
            )
        }
    }
    simulateClick = (e) => {
        if(this.refAnchor.current.focus()){

            if(e.keyCode === 13){
                this.inputSubmit.current.click()
            }
        }
    }

    render(){
        
        const {error, data, search, count, paginationActive, paginationStep,  wordSearch, instance, type, cancelToken, offset} = this.props
        const {valueAnchor} = this.state
        return(
            <section className="searchResults">
                {data.count ? ( 
                    <div className="searchIntoResults">
                        <form onSubmit={this.goAnchor}>
                            <label>Aller directement au résultat n° </label>
                            <input ref={this.refAnchor} 
                            type="number" 
                            max={count}
                            step="1" 
                            onKeyUp={this.simulateClick} 
                            min="0"
                            autoFocus
                            />
                            <input type="submit" value="GO"  ref={this.inputSubmit} />
                            <div className="divHrefB">

                            <a href={valueAnchor} ref={this.refGoAnchor}>lien vers le résultat recherché</a>
                            </div>
                        </form>
                        <p className="text-right pr-4">Nombre total de résultats : {data.count}</p>
                    </div>
                ) : ""}
                <table>
                    <thead>
                        <tr>
                            <th className="score"> # </th>
                            <th className="artist"> Artiste </th>
                            <th className="title"> Titre </th>
                            <th> Album </th>
                            <th> En savoir plus </th>
                        </tr>
                    </thead>
                    <tbody>

        {error ? (
            <tr>
                <td>{error}</td>
            </tr> 
        ) :(data.recordings && paginationActive?
            data.recordings.map((m,i)=> < OneResult key={i} {...m} nbId={i+offset-parseInt(paginationStep)}  {...this.props}/> )
        :data.recordings ? data.recordings.map((m,i)=> < OneResult key={i} {...m} nbId={i}  {...this.props}/> ):( search ? <SVG color="#282c34"/> :
            <tr><td>Aucune recherche en cours</td></tr> 
        ))}
                    </tbody>
                </table>
            {data.recordings && paginationActive && data.count > paginationStep ? <div>
                <Pagination 
                    search={search}
                    wordSearch={wordSearch}
                    instance={instance}
                    type={type}
                    cancelToken={cancelToken}
                    offset={offset}
                    count={count}
                    sendResults={this.props.sendResults} 
                    paginationActive={paginationActive} 
                    paginationStep={paginationStep}
                    /></div> : ""}
            </section>

        )
    }
}

export default SearchResults