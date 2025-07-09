import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "../components/Home/Header";
import useErrorAndLogout from "../components/Utils/ErrorBd";
import { Link } from "react-router-dom";

function Orders() {

const [orders, setOrders] = useState([]);
    const [originalOrders, setOriginalOrders] = useState([]);

    // Importa y usa el custom hook `useErrorAndLogout`
    const showErrorAndLogout = useErrorAndLogout();
    const sitio = localStorage.getItem("Sitio");

    // Función para obtener datos de la API
    const fetchData = () => {
        //Si el sitio es Jesi, una url diferente se usará para obtener los datos
        api.get(sitio === "Shop1" ? "/api/orders/" : "/api/ordersen/")
            .then((res) => {
                const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
                setOriginalOrders(res.data);
            })
            .catch(() => {
                // Llama a `showErrorAndLogout` si ocurre un error
                showErrorAndLogout();
            });
    };

    // Carga los datos iniciales
    useEffect(() => {
        fetchData();
       // sort order by date

    }, []);

    return (
        <Header orders={orders} originalOrders={originalOrders} setOrders={setOrders} fetchData={fetchData} sitio={sitio} />
    );
}

export default Orders;