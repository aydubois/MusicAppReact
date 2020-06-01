import React from 'react'
import './css/App.css'
import Header from './components/Header'
import Footer from './components/Footer'

import Search from './components/Search'
import SeeMore from './components/SeeMore'
import OptionsPagination from './components/OptionsPagination'

import 'bootstrap/dist/css/bootstrap.min.css';
import SearchResults from './components/SearchResults'
import {Modal , Button} from 'react-bootstrap'


class App extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      artists : "",
      id : "",
      releases : "",
      recordings : "",
      genres : [],
      rating: '',
      duration : 0,
      data : [],
      searchBy : "",
      showModal : false,
      dataModal : [],
      cover : [],
      error : "",
      search : "",
      offset : "",
      instance : "",
      count : "",
      wordSearch : "",
      type : "",
      cancelToken : "",
      paginationStep : 25,
      paginationActive : true,
    }
    this.refButtonSearch = React.createRef()
  }



  handleClose = () => {
		this.setState({ showModal: false });
	}

	handleShow = (data) => {
    this.setState({ showModal: true,
      id : data.id,
      artists : data.artists,
      releases : data.albums,
      duration : data.duration,
      recordings : data.titles,
      rating : data.rating,
      genres : data.genres,
      cover : data.cover,
    });

  }
  
  showResultsSearch = (data,dataPagination, search = "")=> {
    if(data === "error"){
      this.setState({
        error : "Aucun résultat pour cette recherche.",
        data : []
      })
    }else{
    if(dataPagination.length !== 0){

      this.setState({
        data : data,
        search : search,
        error : "", 
        offset : dataPagination.offset,
        instance : dataPagination.instance,
        count : dataPagination.count,
        wordSearch : dataPagination.wordSearch,
        type : dataPagination.type,
        cancelToken : dataPagination.cancelToken,
      })
    }else{ 
      this.setState({
      data : data,
      search : search,
      error : "", })
      }
    }
  }

  setValuePaginate = (values) => {
    if(values.desactivePaginate){
      this.setState({
        paginationActive : false,
        paginationStep : false
      },()=>{
        if(this.state.data.length !== 0){
          this.refButtonSearch.current.click()
        }
      } )
    }else{
      this.setState({
        paginationActive : true,
        paginationStep : values.valuePaginate
      },()=>{
        if(this.state.data.length !== 0){
          this.refButtonSearch.current.click()
        }
      })
    }
    
  }
  render(){

    const {error, data, showModal, recordings, search, paginationActive, paginationStep} = this.state
    return (
      <div className="App">
       < Header />
        < Search sendResults={this.showResultsSearch}  
          defaultValue="All" 
          paginationActive={paginationActive} 
          paginationStep={paginationStep}
          search={search} 
          forwardRef={this.refButtonSearch} />

        <OptionsPagination setValuePaginate={this.setValuePaginate} />  
        
        < SearchResults 
          search={search}
          paginationActive={paginationActive} 
          paginationStep={paginationStep} 
          error={error} 
          data={data} 
          wordSearch={this.state.wordSearch}
          instance={this.state.instance}
          type={this.state.type}
          cancelToken={this.state.cancelToken}
          offset={this.state.offset}
          count={this.state.count}
          sendResults={this.showResultsSearch} 
          modalClose={this.handleClose} 
          modalShow={this.handleShow}/> 
        
        {this.state.count >= 25 ? <Footer/> : ""}

        <Modal size="xl" show={showModal}  onHide={this.handleClose}>
        
            <Modal.Header closeButton>
              <Modal.Title>{recordings ?recordings : ""}</Modal.Title>
            </Modal.Header>
            <SeeMore {...this.state}/>

            <Modal.Footer >
              <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                
              </Modal.Footer>
        
        </Modal>
       
      </div>
    );
  }
}


export default App;
