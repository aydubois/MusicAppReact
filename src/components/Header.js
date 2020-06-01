import React from 'react'
import '../css/header.css'

class Header extends React.PureComponent{

    render(){

        return (
            <header>
                <img src="ponyo.png" alt="logo best music app by Ponyo" />
                <div>
                    <h1>Music App</h1>
                    <span>by Ponyo</span>
                </div>
            </header>
        )
    }

}

export default Header;
