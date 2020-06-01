import React, { createRef } from 'react'
import '../css/searchresults.css'

class OptionsPagination extends React.Component{

    constructor(props){
        super(props)
        this.inputSubmit = createRef()
        this.state = {
            desactivePaginate : false,
            valuePaginate : 25,
            open : false,
        }
    }
    
    handleSubmit = (e) => {
        e.preventDefault()
        // if(this.state.desactivePaginate){
        //     return(
        //         alert("Attention la désactivation de la pagination peut créer un délai d'attente assez long si le nombre de résultats est supérieur à 500")
        //     )
        // }
        if(e.target[0].value){
            this.setState({
                valuePaginate : e.target[0].value
            })
        }
        this.props.setValuePaginate({
            "desactivePaginate" : this.state.desactivePaginate,
            "valuePaginate" : this.state.valuePaginate
        })

    }
    handleChange = (e) => {
        if(this.state.desactivePaginate){
            this.setState({
                desactivePaginate:false
            })
        }else{
            this.setState({
                desactivePaginate:true
            })
        }
    }
    simulateClick = (e) => {
        if(e.keyCode === 13){
            this.inputSubmit.current.click()
        }
    }
    openPagination = (e) => {
        if(this.state.open){
            this.setState({ 
                open : false
            })
        }else{

            this.setState({ 
                open : true
            })
        }
    }
    render(){

        return (
            <section className="optionsPagination">
                <button onClick={this.openPagination}>{this.state.open ? "Fermer" : "Ouvrir"} les options de navigation</button>
                {this.state.open ? 
                (<div><form onSubmit={this.handleSubmit}>
                    <div><label htmlFor="selectPagination">Nombre de résultats par page : </label>
                    <input type="number" 
                    placeholder="25"
                    min="25" 
                    max="500" 
                    step="25"
                    onKeyUp={this.simulateClick} name="selectPagination" 
                    id="selectPagination"/></div>
                    <div><label htmlFor="desactivePaginate" className="desact">Désactiver la Pagination</label>
                    <input type="checkbox" name="desactivePaginate" id="desactivePaginate" onChange={this.handleChange}/>
                    </div>
                    <input type='submit' ref={this.inputSubmit} value="Modifier" />
                </form>
                <p>Attention la désactivation de la pagination peut créer un délai d'attente assez long si le nombre de résultats est supérieur à 500</p></div>)
            : ""}
                </section>
        )
    }
}

export default OptionsPagination;
