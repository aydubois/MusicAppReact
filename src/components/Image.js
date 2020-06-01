import React from 'react'
import '../css/searchresults.css'


class Image extends React.PureComponent{

    render(){
        return(
            <img src={this.props.small} alt={this.props.alt}/>
        )
    }
}

export default Image