import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeCss from "../styles/HomeCss";

function Home() {

    const navigate = useNavigate();

    const Shop1 = () => {
        localStorage.setItem("Sitio", "Shop1");
        navigate("/Orders");
    }

    const Shop2 = () => {
        localStorage.setItem("Sitio", "Shop2");
        navigate("/Orders");
    }

    return (
        <div className="container">
            <HomeCss />
            <img src="img/logo.png" className="logo" alt="Logo" />
            <div className="buttons-container">
                <button className="image-button" onClick={Shop1}
                style={{ backgroundImage: 'url(/PhonePageFrontend/img/shop1.jpg)' }}>
                    <div className="overlay">Shop 1</div>
                </button>
                <button className="image-button" onClick={Shop2}
                style={{ backgroundImage: 'url(/PhonePageFrontend/img/shop2.jpg)' }}>
                    <div className="overlay">Shop 2</div>
                </button>
            </div>
        </div>
    );
    
}

export default Home;
