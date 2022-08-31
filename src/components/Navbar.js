import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default function Navbar({account}) {
    const [state, setState] = React.useState({
        title: "Hotel Booking Dapp"
    });

    return (
        <React.Fragment>
            <div className="container mb-2">
                <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                    <Link to="/" className="navbar-brand text-uppercase">{state.title}</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className='navbar-toggler-icon'></span>
                    </button>

                    <div className='collapse navbar-collapse' id="navbarTogglerDemo02">
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li className="nav-item active">
                                <a className='nav-link' href="#">Home</a>
                            </li>
                            <li className="nav-item active">
                                <a className='nav-link' href="#">Hotels</a>
                            </li>
                        </ul>
                        <span className='navbar-text mr-sm-2 float-left'>
                            <p className='my-2 my-sm-0'>{account}</p>
                        </span>
                    </div>
                </nav>
            </div>
        </React.Fragment>
    )
}