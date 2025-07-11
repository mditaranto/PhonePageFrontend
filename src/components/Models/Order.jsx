import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ModalEdit from "../Forms/ModalEditOrder";
import Pagination from "../Utils/Pagination";
import Swal from 'sweetalert2'
import "../../styles/Notification.css"
import api from "../../api";

function Order({ orders, fetchData, tableTab, sitio }) {
    // Estado de la expansión de cada fila
    const [expandedRows, setExpandedRows] = useState({});
    // Estado del modal de edición
    const [isModalActive, setIsModalActive] = useState(false);
    // Estado de los pedidos según su estado
    const [unfinishedOrders, setUnfinishedOrders] = useState([]);
    const [finishedOrders, setFinishedOrders] = useState([]);
    // Estados para recordar la página actual de cada pestaña
    const [currentPageUnfinished, setCurrentPageUnfinished] = useState(1);
    const [currentPageFinished, setCurrentPageFinished] = useState(1);

    // Estado para recordar el pedido seleccionado
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Número de pedidos por página
    const ordersPerPage = 15;

    // Obtener pedidos actuales según la pestaña
    const currentUnfinishedOrders = unfinishedOrders.slice((currentPageUnfinished - 1) * ordersPerPage, currentPageUnfinished * ordersPerPage);
    const currentFinishedOrders = finishedOrders.slice((currentPageFinished - 1) * ordersPerPage, currentPageFinished * ordersPerPage);

    // Media query para detectar el esquema de color preferido del usuario
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const [isDarkMode, setIsDarkMode] = useState(darkModeMediaQuery.matches);

    const [showEstadoFilter, setShowEstadoFilter] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [showOrdinatoFilter, setshowOrdinatoFilter] = useState(false);
    const [filtroOrdinato, setFiltroOrdinato] = useState('');
    const [showAvvertitoFilter, setshowAvvertitoFilter] = useState(false);
    const [filtroAvvertito, setFiltroAvvertito] = useState('');

    const url = sitio === "Shop1" ? "/api/orders/" : "/api/ordersen/";

    const toggleAvvertitoFilter = () => {
        setshowAvvertitoFilter(!showAvvertitoFilter);
    };

    const handleAvvertitoChange = (value) => {
        setFiltroAvvertito(value);
        toggleAvvertitoFilter();
    };

    const toggleOrdinatoFilter = () => {
        setshowOrdinatoFilter(!showOrdinatoFilter);
    };

    const handleOrdinatoChange = (value) => {
        setFiltroOrdinato(value);
        toggleOrdinatoFilter();
    };

    const toggleEstadoFilter = () => {
        setShowEstadoFilter(!showEstadoFilter);
    };

    const handleEstadoChange = (value) => {
        setFiltroEstado(value);
        toggleEstadoFilter();
    };
    // Filtrar los pedidos según su estado
    useEffect(() => {
        if (Array.isArray(orders)) {
            const unfinished = orders.filter(order => !order.finished);
            const finished = orders.filter(order => order.finished);
            setUnfinishedOrders(unfinished);
            setFinishedOrders(finished);
        } else {
            setUnfinishedOrders([]);
            setFinishedOrders([]);
        }
    }, [orders]);

    useEffect(() => {
        // Función de callback que se ejecuta cuando cambia la preferencia de esquema de color
        const handleColorSchemeChange = (event) => {
            setIsDarkMode(event.matches);
        };

        // Añadir el evento de escucha a darkModeMediaQuery
        darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);

        // Limpiar el evento de escucha cuando el componente se desmonte
        return () => {
            darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange);
        };
    }, []);



    // Formatear fecha
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString("es-ES", options);
    };


    // Eleccion entre abrir pdf
    const handleChoicePdf = async (order) => {
        const result = await Swal.fire({
            title: 'Open PDF',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Invoice',
            cancelButtonText: 'Data',
            customClass: isDarkMode ? 'swal2-dark' : '',
        });
        if (result.isConfirmed) {
            window.open(`/PhonePageFrontend/pdf/fattura/${order.idOrder}`, '_blank');
        } else if (result.dismiss === 'backdrop' || result.dismiss === 'esc') {
            // No hacer nada si el usuario hace clic fuera del alert o presiona la tecla Esc
        } else {
            window.open(`/PhonePageFrontend/pdf/data/${order.idOrder}`, '_blank');
        }
    };

    // Confirmacion de eliminacion
    const handleChoice = async (order) => {
        const result = await Swal.fire({
            title: 'Finish order?',
            text: "It can be undone later.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes, finish it!",
            customClass: isDarkMode ? 'swal2-dark' : '',
        });

        if (result.isConfirmed) {
            // Lógica para manejar la confirmación
            handleFinishOrder(order);
        }
    };

    // Manejar el finalizado del pedido
    const handleFinishOrder = async (order) => {
        try {
            if (order.finished === false) {
                await api.put(`${url}${order.idOrder}/`, { finished: true, status: 'out'});
                // Muestra una notificación de éxito con SweetAlert2 que se cierra automáticamente después de 3 segundos
                await Swal.fire({
                    icon: 'success',
                    title: 'Order marked as finished',
                    text: "The order has been marked as finished.",
                    timer: 2000, // Cierra automáticamente después de 3 segundos (3000 milisegundos)
                    timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
                    customClass: isDarkMode ? 'swal2-dark' : '',
                });
            } else {
                await api.put(`${url}${order.idOrder}/`, { finished: false });
                // Muestra una notificación de advertencia con SweetAlert2 que se cierra automáticamente después de 3 segundos
                await Swal.fire({
                    icon: 'success',
                    title: 'Order marked as unfinished',
                    text: "The order has been marked as unfinished.",
                    timer: 2000, // Cierra automáticamente después de 3 segundos
                    timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
                    customClass: isDarkMode ? 'swal2-dark' : '',

                });
            }
            // Vuelve a cargar los datos después de actualizar el pedido
            fetchData();

        } catch (error) {
            // Muestra una notificación de error con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "There was an error updating the order.",
                timer: 2000, // Cierra automáticamente después de 3 segundos
                timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
            });
        }
    };


    // Alternar la expansión de una fila específica
    const handleRowClick = (idOrder) => {
        setExpandedRows((prev) => ({
            ...prev,
            [idOrder]: !prev[idOrder]
        }));
    };

    const handleEditClick = (order) => {
        setSelectedOrder(order); // Actualizar el estado con el pedido seleccionado
        setIsModalActive(true);
    };

    // Animaciones de apertura y cierre con GSAP
    const additionalInfoRefs = useRef({});
    useLayoutEffect(() => {
        // Verificar si el modal está activo
        if (!isModalActive) {
            Object.keys(expandedRows).forEach((idOrder) => {
                const ref = additionalInfoRefs.current[idOrder];
                if (ref) {
                    gsap.to(ref, {
                        height: expandedRows[idOrder] ? ref.scrollHeight : 0,
                        duration: 0.5,
                        ease: "power2.inOut",
                    });
                }
            });
        }
    }, [expandedRows, isModalActive]);

    // Manejar el cambio de página
    const handlePaginate = (pageNumber) => {
        if (tableTab === 'unfinished') {
            setCurrentPageUnfinished(pageNumber);
        } else if (tableTab === 'finished') {
            setCurrentPageFinished(pageNumber);
        }
    };

    // Cuando se cambie de pestaña, restablecer la página actual de la pestaña
    useEffect(() => {
        if (tableTab === 'unfinished') {
            setCurrentPageUnfinished(1);
        } else if (tableTab === 'finished') {
            setCurrentPageFinished(1);
        }
    }, [tableTab]);

    const style = { verticalAlign: 'middle' };
    const divStyle = { paddingTop: '5px', cursor: 'pointer', borderBottom: '1px solid #00D1B2', paddingBottom: '5px' }


    return (
        <div>
            <table style={{minHeight:'200px'}} className="table is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th style={style}>Order data</th>
                        <th style={style}>Client</th>
                        <th style={style}>Phone number</th>
                        <th style={style}>Piece name</th>
                        <th style={style}>Model</th>
                        <th style={style}>Defect</th>
                        <th style={{ position: 'relative', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Shipped
                                <span style={{ cursor: 'pointer' }} onClick={toggleOrdinatoFilter} >&#9660;</span>
                            </div>
                            <div className="dropdown" style={{ position: 'absolute', top: '100%', left: '0', zIndex: '1', display: showOrdinatoFilter ? 'block' : 'none', width: '100%', border: '1px solid #00D1B2', borderRadius: '5px', maxHeight:'120px'}}>
                                <div className="dropdown-content" style={{ padding: '0' }}>
                                    <div style={{ ...divStyle, backgroundColor: filtroOrdinato === "" ? '#f0f0f0' : 'transparent' }} onClick={() => handleOrdinatoChange("")}>All</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroOrdinato === "Si" ? '#f0f0f0' : 'transparent' }} onClick={() => handleOrdinatoChange("Si")}>Yes</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroOrdinato === "No" ? '#f0f0f0' : 'transparent' }} onClick={() => handleOrdinatoChange("No")}>No</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroOrdinato === "Mag" ? '#f0f0f0' : 'transparent' }} onClick={() => handleOrdinatoChange("Mag")}>Arr</div>
                                </div>
                            </div>
                        </th>
                        <th style={{ position: 'relative', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Status <span style={{ cursor: 'pointer' }} onClick={toggleEstadoFilter} >&#9660;</span>
                            </div>
                            <div className="dropdown" style={{ position: 'absolute', top: '100%', left: '0', zIndex: '1', display: showEstadoFilter ? 'block' : 'none', width: '100%', border: '1px solid #00D1B2', borderRadius: '5px'}}>
                                <div className="dropdown-content" style={{ padding: '0' }}>
                                    <div style={{ ...divStyle, backgroundColor: filtroEstado === "" ? '#f0f0f0' : 'transparent' }} onClick={() => handleEstadoChange("")}>All</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroEstado === "lav" ? '#f0f0f0' : 'transparent' }} onClick={() => handleEstadoChange("lav")}>lav</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroEstado === "out" ? '#f0f0f0' : 'transparent' }} onClick={() => handleEstadoChange("out")}>out</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroEstado === "cl" ? '#f0f0f0' : 'transparent' }} onClick={() => handleEstadoChange("cl")}>cl</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroEstado === "prev" ? '#f0f0f0' : 'transparent' }} onClick={() => handleEstadoChange("prev")}>prev</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroEstado === "new" ? '#f0f0f0' : 'transparent' }} onClick={() => handleEstadoChange("new")}>new</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroEstado === "est" ? '#f0f0f0' : 'transparent' }} onClick={() => handleEstadoChange("est")}>est</div>
                                </div>
                            </div>
                        </th>
                        <th style={{ position: 'relative', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Advised <span style={{ cursor: 'pointer' }} onClick={toggleAvvertitoFilter} >&#9660;</span>
                            </div>
                            <div className="dropdown" style={{ position: 'absolute', top: '100%', left: '0', zIndex: '1', display: showAvvertitoFilter ? 'block' : 'none', width: '100%', border: '1px solid #00D1B2', borderRadius: '5px' }}>
                                <div className="dropdown-content" style={{ padding: '0' }}>
                                    <div style={{ ...divStyle, backgroundColor: filtroOrdinato === "" ? '#f0f0f0' : 'transparent' }} onClick={() => handleAvvertitoChange("")}>All</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroOrdinato === true ? '#f0f0f0' : 'transparent' }} onClick={() => handleAvvertitoChange(true)}>Yes</div>
                                    <div style={{ ...divStyle, backgroundColor: filtroOrdinato === false ? '#f0f0f0' : 'transparent' }} onClick={() => handleAvvertitoChange(false)}>No</div>
                                </div>
                            </div>
                        </th>
                        <th style={style}>Actions</th>
                    </tr>   
                </thead>
                <tbody>
                    {(tableTab === 'unfinished' ? currentUnfinishedOrders : currentFinishedOrders)
                        .filter(order => {
                            if (filtroAvvertito === '' && filtroEstado === '' && filtroOrdinato === '') {
                                return true;
                            }
                            if (filtroAvvertito === '') {
                                if (filtroEstado === '') {
                                    return order.shipped === filtroOrdinato;
                                } else if (filtroOrdinato === '') {
                                    return order.status === filtroEstado;
                                } else {
                                    return order.shipped === filtroOrdinato && order.status === filtroEstado;
                                }
                            } else if (filtroEstado === '') {
                                if (filtroOrdinato === '') {
                                    return order.clientAdviser === filtroAvvertito;
                                } else {

                                    return order.clientAdviser === filtroAvvertito && order.shipped === filtroOrdinato;
                                }
                            } else if (filtroOrdinato === '') {
                                return order.clientAdviser === filtroAvvertito && order.status === filtroEstado;
                            } else {
                                return order.clientAdviser === filtroAvvertito && order.shipped === filtroOrdinato && order.status === filtroEstado;
                            }
                        }
                        )
                        .map((order) => (
                            <React.Fragment key={order.idOrder}>
                                {/* Fila principal */}
                                <tr onClick={() => handleRowClick(order.idOrder)} style={{ cursor: "pointer" }}>
                                    <td style={style}>{formatDate(order.createdAt)}</td>
                                    <td style={style}>{order.nameCustomer} {order.surnameCustomer}</td>
                                    <td style={style}>{order.phoneNumber}</td>
                                    <td style={style}>{order.pieceName}</td>
                                    <td style={style}>{order.modelPhone}</td>
                                    <td style={style}>{order.defect}</td>
                                    <td style={style}>{order.shipped}</td>
                                    <td style={style}>{order.status}</td>
                                    <td style={style}>{order.clientAdviser ? 'Si' : 'No'}</td>
                                    <td style={style}>
                                        <button
                                            className="mr-3 fa fa-edit"
                                            style={{ color: "#FFF177" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(order);
                                            }}
                                        >
                                        </button>
                                        <button
                                            className="mr-3 fa fa-file-pdf-o"
                                            style={{ color: "#FFC107" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChoicePdf(order);
                                            }}
                                        ></button>
                                        {!order.finished && (
                                            <button
                                                className="fa fa-check-square"
                                                style={{ color: "#63E6BE" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleChoice(order)
                                                }}
                                            >
                                            </button>
                                        )}
                                        {
                                            // Si el pedido está terminado, muestra un botón para volver a ponerlo como no terminado
                                            order.finished && (
                                                <button
                                                    className="fa fa-undo" // Clase CSS para el ícono de deshacer (o similar)
                                                    style={{ color: "#E06D5B" }} // Puedes elegir un color diferente
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChoice(order)
                                                    }} // Llama a la función handleUnfinishedOrder al hacer clic
                                                >
                                                </button>
                                            )
                                        }
                                    </td>
                                </tr>

                                {/* Información adicional */}
                                <tr>
                                    <td colSpan="10" style={{ padding: 0, border: 0 }}>
                                        <div
                                            ref={el => additionalInfoRefs.current[order.idOrder] = el}
                                            style={{
                                                height: 0,
                                                overflow: "hidden",
                                                backgroundColor: "transparent",
                                            }}
                                        >
                                            <div className="content">
                                                <p className="has-text-centered is-size-4">
                                                    <strong>Order data:</strong> {formatDate(order.createdAt)}
                                                </p>

                                                <div className="columns has-text-centered is-gapless p-1 mb-5">
                                                    <div className="column">
                                                        <p><strong>Piece name:</strong> {order.pieceName}</p>
                                                        <p><strong>Model:</strong> {order.modelPhone}</p>
                                                        <p><strong>Guarantee:</strong> {order.guarantee ? 'Si' : 'No'}</p>
                                                        <p><strong>Advised client:</strong> {order.clientAdviser ? 'Si' : 'No'}</p>
                                                    </div>
                                                    <div className="column">
                                                        <p><strong>Client:</strong> {order.nameCustomer} {order.surnameCustomer}</p>
                                                        <p><strong>Defect:</strong> {order.defect}</p>
                                                        <p><strong>Price:</strong> {order.price} €</p>
                                                        <p className="has-text-centered is-gapless"><strong>Nota:</strong> {order.notes}</p>
                                                    </div>
                                                    <div className="column">
                                                        <p><strong>Finished:</strong> {order.finished ? 'Si' : 'No'}</p>
                                                        <p><strong>State:</strong> {order.status}</p>
                                                        <p><strong>Shipped:</strong> {order.shipped}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                </tbody>
            </table>


            {isModalActive && (
                <ModalEdit
                    formData={selectedOrder} // Pasar el pedido seleccionado al modal
                    isActive={isModalActive}
                    closeModal={() => setIsModalActive(false)}
                    fetchData={fetchData}
                />
            )}
            {/* Paginación */}
            <Pagination
                ordersPerPage={ordersPerPage}
                totalOrders={tableTab === 'unfinished' ? unfinishedOrders.length : finishedOrders.length}
                paginate={handlePaginate}
                activePage={tableTab === 'unfinished' ? currentPageUnfinished : currentPageFinished}
            />
        </div>
    );
}

export default Order;
