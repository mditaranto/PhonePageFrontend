import React from 'react';
import Pagination from '../Utils/Pagination'; // Asegúrate de importar el componente de paginación

function Phone({ orders }) {
    // Estado para la página actual
    const [currentPage, setCurrentPage] = React.useState(1);
    // Número de teléfonos por página
    const ordersPerPage = 15;

    // Calcular el índice del primer y último teléfono de la página actual
    const indexOfLastPhone = currentPage * ordersPerPage;
    const indexOfFirstPhone = indexOfLastPhone - ordersPerPage;

    // Obtener los teléfonos de la página actual
    const currentorders = orders.slice(indexOfFirstPhone, indexOfLastPhone);

    // Función para manejar el cambio de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <table className="table is-striped is-hoverable is-fullwidth mb-5">
                <thead>
                    <tr>
                        <th>Model</th>
                        <th>Defect</th>
                        <th>Client</th>
                    </tr>
                </thead>
                <tbody>
                    {currentorders.map((phone) => (
                        <tr key={phone.idOrder}>
                            <td>{phone.modelPhone}</td>
                            <td>{phone.defect}</td>
                            <td>{phone.nameCustomer} {phone.surnameCustomer}</td>
                        </tr>
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


export default Phone;
