import React, { useState } from 'react';
import Pagination from '../Utils/Pagination'; // Asegúrate de importar el componente de paginación

function Piece({ orders }) {
    // Estado para la página actual
    const [currentPage, setCurrentPage] = useState(1);
    // Número de piezas por página
    const ordersPerPage = 15;

    // Calcular el índice del primer y último pedido de la página actual
    const indexOfLastPiece = currentPage * ordersPerPage;
    const indexOfFirstPiece = indexOfLastPiece - ordersPerPage;

    // Obtener las piezas de la página actual
    const currentorders = orders.slice(indexOfFirstPiece, indexOfLastPiece);

    // Función para manejar el cambio de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    const guaranteeStatus = (guarantee) => (guarantee ? 'Yes' : 'No');

    return (
        <div>
            <table className="table is-striped is-hoverable is-fullwidth mb-5">
                <thead>
                    <tr>
                        <th>Piece name</th>
                        <th>Status</th>
                        <th>Shipped</th>
                        <th>Guarantee</th>
                    </tr>
                </thead>
                <tbody>
                    {currentorders.map((piece) => (
                        // Agregar condición para verificar si el nombre de la pieza no está vacío
                        piece.pieceName && (
                            <tr key={piece.idOrder}>
                                <td>{piece.pieceName}</td>
                                <td>{piece.status}</td>
                                <td>{piece.shipped}</td>
                                <td>{guaranteeStatus(piece.guarantee)}</td>
                            </tr>
                        )
                    ))}
                </tbody>

            </table>

            {/* Componente de paginación */}
            <Pagination
                ordersPerPage={ordersPerPage}
                totalOrders={orders.length}
                paginate={paginate}
                activePage={currentPage}
            />
        </div>
    );
}

export default Piece;
