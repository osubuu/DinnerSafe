import React from "react";
import { Link } from "react-router-dom";


const Header = (props) => {
    return(
        <header>
            <div className="wrapper">
                <div className="inner-header clearfix">
                    <h1 className="app-name">DinnerSafe</h1>
                    <div className="user clearfix">
                        <h2>{props.user}</h2>
                        <Link className="log-out" onClick={props.handleLogout} to="/">Log Out</Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;