import React, { useState } from 'react';
import Pagination from '../Utils/Pagination'; // Asegúrate de importar el componente de paginación

function Customer({ orders }) {
    // Estado para la página actual
    const [currentPage, setCurrentPage] = useState(1);
    // Número de clientes por página
    const ordersPerPage = 15;

    // Calcular el índice del primer y último pedido de la página actual
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

    // Agrupar los pedidos por nombre y apellido de cliente, y contar cuántos pedidos tiene cada cliente
    const groupedOrders = orders.reduce((acc, order) => {
        const key = `${order.phoneNumber}`;
        if (!acc[key]) {
            acc[key] = {
                ...order,
                count: 0,
            };
        }
        acc[key].count += 1;
        return acc;
    }, {});

    // Convertir el objeto agrupado en una matriz de clientes
    const customers = Object.values(groupedOrders);

    // Obtener los clientes de la página actual
    const currentCustomers = customers.slice(indexOfFirstOrder, indexOfLastOrder);

    // Función para manejar el cambio de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <table className="table is-striped is-hoverable is-fullwidth mb-5">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Phone Number</th>
                        <th>Orders Number</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCustomers.map((customer) => (
                        <tr key={customer.idOrder}>
                            <td>{customer.nameCustomer}</td>
                            <td>{customer.surnameCustomer}</td>
                            <td>{customer.phoneNumber}</td>
                            <td>{customer.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Componente de paginación */}
            <Pagination
                ordersPerPage={ordersPerPage}
                totalOrders={customers.length}
                paginate={paginate}
                activePage={currentPage}
            />
        </div>
    );
}

export default Customer;