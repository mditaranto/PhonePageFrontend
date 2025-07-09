import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api";
import Papa from "papaparse";
import Order from "../Models/Order";
import Customer from "../Models/Customer";
import Searchbar from "../Utils/SearchBar";
import Phone from "../Models/Phone";
import Piece from "../Models/Piece";
import * as XSLX from 'xlsx';

function Header({ orders, originalOrders, setOrders, fetchData, sitio }) {
    const [navTab, setNavTab] = useState("pane-1");
    const [tableTab, setTableTab] = useState("unfinished");
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [isDocsActive, setIsDocsActive] = useState(false); // Estado para controlar la visibilidad de `Docs`

    const currentDate = new Date().toISOString().split("T")[0];

    const url = sitio === "Shop1" ? "/api/orders/" : "/api/ordersen/";

    const exportToExcel = async () => {
        try {
            const response = await api.get(url);
            const orders = response.data;
            const wb = XSLX.utils.book_new();
            const ws = XSLX.utils.json_to_sheet(orders, {
                cellStyles: true, // Habilitar el estilo de celda
                cellDates: true, // Detectar automáticamente y formatear las fechas de las celdas
            })

            XSLX.utils.book_append_sheet(wb, ws, "Sheet1");
            XSLX.writeFile(wb, `${currentDate}.xlsx`);
        } catch (error) {
            alert("Error downloading Excel file");
            console.error(error);
        }
    };

    const exportToCSV = async () => {
        try {
            const response = await api.get(url);
            const orders = response.data;
            const csv = Papa.unparse(orders);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", `${currentDate}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert("Error downloading CSV file");
            console.error(error);
        }
    };

    const toggleMenu = () => {
        setIsMenuActive(!isMenuActive);
    };

    const toggleDocsMenu = () => {
        setIsDocsActive(!isDocsActive);
    };

    return (
        <div>
            <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a
                        role="button"
                        className={`navbar-burger burger ${isMenuActive ? "is-active" : ""}`}
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbarMenu"
                        onClick={toggleMenu}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarMenu" className={`navbar-menu ${isMenuActive ? "is-active" : ""}`}>
                    <div className="navbar-start">
                        <div className="navbar-item is-hoverable">
                            <Link className="navbar-item" to="/">Home</Link>

                            <p className="navbar-link" onClick={toggleDocsMenu}>
                                Docs
                            </p>
                            <div className={`navbar-dropdown is-boxed ${isDocsActive ? "" : "is-hidden"}`}>
                                <a className="navbar-item" href="/Admin">Admin</a>
                                <a className="navbar-item" href="cover.html">Support</a>
                            </div>
                        </div>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <button className="button is-link" onClick={exportToExcel}>
                                    <span className="icon">
                                        <i className="fas fa-file-excel"></i>
                                    </span>
                                    <span>Download excel</span>
                                </button>
                                <button className="button is-link" onClick={exportToCSV}>
                                    <span className="icon">
                                        <i className="fas fa-download"></i>
                                    </span>
                                    <span>Download CSV</span>
                                </button>
                                <Link className="button is-danger" to="/logout">
                                    <span className="icon">
                                        <i className="fa fa-user-times"></i>
                                    </span>
                                    <span>Log out</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="hero is-primary">
                <div className="container m-1">
                    <img
                        src={"img/logo.png"}
                        alt="site-logo"
                        className="py-2 px-2"
                        style={{ maxHeight: 90 }}
                    />

                </div>
                <div className="container m-1 has-text-right">
                    <p className="title">{sitio}</p>
                </div>
            </section>

            <div>
                <nav className="mt-2 tabs is-medium is-centered nav-menu" id="nav">
                    <ul>
                        <li onClick={() => setNavTab("pane-1")} className={navTab === "pane-1" ? "is-active" : ""}>
                            <a>
                                <span className="icon is-small">
                                    <i className="fa fa-envelope"></i>
                                </span>
                                <span>Orders</span>
                            </a>
                        </li>
                        <li onClick={() => setNavTab("pane-2")} className={navTab === "pane-2" ? "is-active" : ""}>
                            <a>
                                <span className="icon is-small">
                                    <i className="fa fa-users"></i>
                                </span>
                                <span>Clients</span>
                            </a>
                        </li>
                        <li onClick={() => setNavTab("pane-3")} className={navTab === "pane-3" ? "is-active" : ""}>
                            <a>
                                <span className="icon is-small">
                                    <i className="fa fa-mobile"></i>
                                </span>
                                <span>Smarthphones</span>
                            </a>
                        </li>
                        <li onClick={() => setNavTab("pane-4")} className={navTab === "pane-4" ? "is-active" : ""}>
                            <a>
                                <span className="icon is-small">
                                    <i className="fa fa-screwdriver"></i>
                                </span>
                                <span>Piece</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="tab-content mt-5 ">
                    <div className="tab-pane">
                        <div className="container">
                            <div className="columns is-centered">
                                <div className="column">
                                    {(() => {
                                        switch (navTab) {
                                            case "pane-1":
                                                return (
                                                    <div>
                                                        <div className="columns">
                                                            <div className="navbar">
                                                                <a
                                                                    className={`navbar-item ${tableTab === "unfinished" ? "is-active" : ""}`}
                                                                    onClick={() => setTableTab("unfinished")}
                                                                >
                                                                    Unfinished orders
                                                                </a>
                                                                <a
                                                                    className={`navbar-item ${tableTab === "finished" ? "is-active" : ""}`}
                                                                    onClick={() => setTableTab("finished")}
                                                                >
                                                                    Finished orders
                                                                </a>
                                                            </div>
                                                            <div className="columns control ml-auto">
                                                                <div className="column ">
                                                                    <Searchbar
                                                                        originalOrders={originalOrders}
                                                                        setOrders={setOrders}
                                                                        navTab={navTab}
                                                                    />
                                                                </div>
                                                                <div className="column">
                                                                    <Link className="button is-success" to="/orders/create">
                                                                        <span className="icon">
                                                                            <i className="fas fa-plus-circle"></i>
                                                                        </span>
                                                                        <span>Create Order</span>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="table-container is-justify-content-center mb-6">
                                                            <Order orders={orders} fetchData={fetchData} tableTab={tableTab} sitio={sitio} />
                                                        </div>
                                                    </div>
                                                );
                                            case "pane-2":
                                                return <div>
                                                    <div className="columns">
                                                        <div className="column" style={{ maxWidth: 300 }}>
                                                            <Searchbar
                                                                originalOrders={originalOrders}
                                                                setOrders={setOrders}
                                                                navTab={navTab}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Customer orders={orders} />
                                                </div>;
                                            case "pane-3":
                                                return <div>
                                                    <div className="columns">
                                                        <div className="column" style={{ maxWidth: 300 }}>
                                                            <Searchbar
                                                                originalOrders={originalOrders}
                                                                setOrders={setOrders}
                                                                navTab={navTab}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Phone orders={orders} />
                                                </div>;
                                            case "pane-4":
                                                return <div>
                                                    <div className="columns">
                                                        <div className="column" style={{ maxWidth: 300 }}>
                                                            <Searchbar
                                                                originalOrders={originalOrders}
                                                                setOrders={setOrders}
                                                                navTab={navTab}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Piece orders={orders} />
                                                </div>;
                                            default:
                                                return null;
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;

