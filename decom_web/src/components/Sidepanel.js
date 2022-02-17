import React from "react";
import { useState } from 'react';

export const Sidepanel = ( { onItemSelect } ) => {

    const [activeItem, setActiveItem ] = useState("")

    const _onItemSelect = (id) => {
        setActiveItem(id);
        onItemSelect(id);
    }

    return (
        <div className="Sidepanel">
            <img src="logo_size.jpg" alt="Logo goes here!"></img>
            <h5>Welcome to DECOM Report tool.</h5>
            <br />
            
            <b>Select a report:</b>
            <div>
                <a className={ activeItem == 1 ? "active" : '' } onClick={() => _onItemSelect(1)} id="1">Turnover per brand</a>
                <a className={ activeItem == 2 ? "active" : '' } onClick={() => _onItemSelect(2)} id="2">Turnover per day</a>
            </div>
        </div>
    );
}