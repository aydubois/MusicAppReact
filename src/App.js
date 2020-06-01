import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Search from './components/Search'
import SeeMore from './components/SeeMore'
import OptionsPagination from './components/OptionsPagination'
import SearchResults from './components/SearchResults'

import {Modal , Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css'


class App extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      artists : '',
      id : '',
      releases : '',
      recordings : '',
      rating: '',
      error : '',
      search : '',
      offset : '',
      instance : '',
      count : '',
      wordSearch : '',
      type :'',
      cancelToken : '',
      genres : [],
      data : [],
      cover : [],
      showModal : false,
      paginationActive : true,
      paginationStep : 25,
      duration : 0,
    }
    this.refButtonSearch = React.createRef()
  }


  /**
  * Close the modal
  */
  handleClose = () => {
		this.setState({ showModal: false });
	}

  /**
   * Retrieves the data from a recording and opens the modal
   */
	handleShow = (data) => {
    this.setState({ 
      showModal: true,
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
  

  /**
   * Retrieves the data from all results 
   * @param data = general data
   * @param dataPag = use for pagination
   * @param search = check if a search is in progress
   */
  showResultsSearch = (data,dataPag, search = '')=> {

    if(data === 'error'){
      this.setState({
        error : 'Aucun résultat pour cette recherche.',
        data : []
      })

    }else{

      if(dataPag.length !== 0){
        this.setState({
          data : data,
          search : search,
          error : '', 
          offset : dataPag.offset,
          instance : dataPag.instance,
          count : dataPag.count,
          wordSearch : dataPag.wordSearch,
          type : dataPag.type,
          cancelToken : dataPag.cancelToken,
        })

      }else{ 
        this.setState({
          data : data,
          search : search,
          error : '' 
        })
      }
    }
  }

  /**
   * Use when button from pagination options is clicked
   * @param values => allows to know if pagination is active and if so, what is its step
   */
  setValuePaginate = (values) => {
    const {data} = this.state

    // if no paging => no step 
    if(values.desactivePaginate){
      this.setState({
        paginationActive : false,
        paginationStep : false
      },()=>{
        //if data => research reactualization
        if(data.length !== 0){
          this.refButtonSearch.current.click()
        }
      })

    }else{
      this.setState({
        paginationActive : true,
        paginationStep : values.valuePaginate
      },()=>{
        if(data.length !== 0){
          this.refButtonSearch.current.click()
        }
      })
    }
  }


  render(){

    const {error, data, showModal, recordings, search, paginationActive, paginationStep, wordSearch, instance, type, cancelToken, offset, count} = this.state

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
          wordSearch={wordSearch}
          instance={instance}
          type={type}
          cancelToken={cancelToken}
          offset={offset}
          count={count}
          sendResults={this.showResultsSearch} 
          modalClose={this.handleClose} 
          modalShow={this.handleShow}/> 
        

        {this.state.count >= 25 ? <Footer/> : ""}


        {/* Modal for one recording */}
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
    )
  }
}


export default App;
