import React from 'react'
import '../css/header.css'

class Footer extends React.PureComponent{
    constructor(props){
        super(props)
        this.link = "#"
    }
    render(){

        return (
            <footer>
                <div>
                <img src="ponyo.png" alt="logo best music app by Ponyo" />
                    <h2>Music App <span> @Copyright Ponyo</span></h2>
                </div>
                <a href={this.link}>haut de page</a>
            </footer>
        )
    }

}

export default Footer;
