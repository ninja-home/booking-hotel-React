import React, {Component} from 'react';
import {Circles} from 'react-loader-spinner';

export default function PageLoader() {
    return (
        <Circles 
            //Puff ,Mutating Dots ,ThreeDots, TailSpin, Rings, Oval, Hearts,Circles,Ball-Triangle,Audio
            color="#00BFFF" 
            height={200} 
            width={100}
            visible={true}
            // style={{display: flex}}
        />
    )
}