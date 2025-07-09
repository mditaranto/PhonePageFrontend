import React, { useState, useEffect } from 'react';
import api from "../../api";
//import "../styles/Modal.css";
import { Input } from './Input';
import { FormProvider, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

function ModalEdit({ formData, closeModal, isActive, fetchData }) {
    const methods = useForm()
    const [formData2, setFormData] = useState({});
    const orderId = formData && formData.idOrder; // Verifica si formData está definido antes de acceder a idOrder

    const sitio = localStorage.getItem("Sitio");

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const [isDarkMode, setIsDarkMode] = useState(darkModeMediaQuery.matches);

    useEffect(() => {
        if (formData)
            setFormData(formData);
    }, [formData]); // Fetch the order data when the component mounts

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

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        let inputValue = type === 'checkbox' ? checked : value;

        const firstDigit = value.substring(0, 1);
        const restOfNumber = value.substring(1);

        // Si el primer dígito es cero, establecer el valor como el resto del número
        if (firstDigit === '0' && name === 'price') {
            setFormData({ ...formData2, [name]: restOfNumber });
        } else {
            setFormData({ ...formData2, [name]: inputValue });
        }

    };

    // Manejar la modificacion del pedido
    const onSubmit = async () => {
        closeModal();
        try {
            const url = sitio === "Jesi" ? "/api/orders/" : "/api/ordersen/";
            await api.put(`${url}${orderId}/`, formData2);
            // Muestra una notificación de éxito con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'success',
                title: 'Order modified',
                text: "The order has been modified successfully",
                timer: 2000, // Cierra automáticamente después de 3 segundos (3000 milisegundos)
                timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
                customClass: isDarkMode ? 'swal2-dark' : '',

            });
            fetchData();

        } catch (error) {
            // Muestra una notificación de error con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "The order could not be modified",
                timer: 2000, // Cierra automáticamente después de 3 segundos
                timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
            });

        }

    };

    return (
        <div className={`modal is-mobile dark ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head" style={{ backgroundColor: '#00D1B2' }}>
                    <p className="modal-card-title">Modify order</p>
                    <button className="delete" aria-label="close" onClick={closeModal}></button>
                </header>
                <section style={{ margin: 0 }} className="modal-card-body">
                    <FormProvider {...methods}>
                        <form onSubmit={e => e.preventDefault()}
                            noValidate>
                            {/* Nombre del cliente */}
                            <div className="field mb-4 is-grouped" style={{ justifyContent: 'space-between' }}>
                                <Input
                                    label="Name"
                                    type="text"
                                    name="nameCustomer"
                                    placeholder="Name"
                                    value={formData2.nameCustomer || ''}
                                    onChange={handleChange}
                                />
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Cognome" className="label is-small">
                                        Surname
                                    </label>
                                    <input
                                        className='input is-medium'
                                        type="text"
                                        name="surnameCustomer"
                                        placeholder="Surname"
                                        value={formData2.surnameCustomer || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <div className="control">
                                    <Input
                                        label={"Phone Number"}
                                        type="text"
                                        name="phoneNumber"
                                        placeholder='Phone Number'
                                        value={formData2.phoneNumber || ""}
                                        onChange={handleChange}
                                        pattern="[0-9]*" // Solo permite números

                                    />
                                </div>
                            </div>

                            <div className="field">
                                <div className="control">
                                    <Input
                                        label={"Model"}
                                        type="text"
                                        name="modelPhone"
                                        placeholder='Model'
                                        value={formData2.modelPhone || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <div className="control">
                                    <Input
                                        label={"Defect"}
                                        type="text"
                                        name="defect"
                                        placeholder='Defect'
                                        value={formData2.defect || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field mb-4 is-grouped" style={{ justifyContent: 'space-between' }}>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Pezzo" className="label is-small">
                                        Piece Name
                                    </label>
                                    <input
                                        className='input is-medium'
                                        type="text"
                                        name="pieceName"
                                        placeholder="Piece Name"
                                        value={formData2.pieceName || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="Costo" className="label is-small">
                                        Price
                                    </label>
                                    <input
                                        className='input is-medium'
                                        placeholder="Price"
                                        type="number"
                                        name="price"
                                        value={formData2.price || 0}
                                        onChange={handleChange}
                                        min={0}
                                    />
                                </div>
                            </div>

                            <div className="field mb-4">
                                <div className="columns is-variable is-8">
                                    <div className="column">
                                        <label className="label is-small">Status</label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select
                                                    name="status"
                                                    value={formData2.status || ''}
                                                    onChange={handleChange}
                                                >
                                                    <option value="lav">lav</option>
                                                    <option value="out">out</option>
                                                    <option value="cl">cl</option>
                                                    <option value="prev">prev</option>
                                                    <option value="new">new</option>
                                                    <option value="est">est</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <label className="label is-small">Shipped</label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select
                                                    name="shipped"
                                                    value={formData2.shipped || ''}
                                                    onChange={handleChange}
                                                >
                                                    <option value="No">No</option>
                                                    <option value="Si">Si</option>
                                                    <option value="Mag">Arr</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label is-small">Notes</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        name="notes"
                                        value={formData2.notes || ""}
                                        onChange={handleChange}
                                        placeholder='Enter notes...'
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <div className="control" style={{ minWidth: 100 }}>
                                    <label className="checkbox" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        Guarantee
                                        <input
                                            type="checkbox"
                                            name="guarantee"
                                            checked={formData2.guarantee || false}
                                            onChange={handleChange}
                                            style={{ maxWidth: 50, margin: 0 }} // Ajusta el espacio entre el checkbox y el texto
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="field">
                                <div className="control" style={{ minWidth: 100 }}>
                                    <label className="checkbox" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        Client Advised
                                        <input
                                            type="checkbox"
                                            name="clientAdviser"
                                            checked={formData2.clientAdviser || false}
                                            onChange={handleChange}
                                            style={{ maxWidth: 50, margin: 0 }} // Ajusta el espacio entre el checkbox y el texto
                                        />
                                    </label>
                                </div>
                            </div>
                        </form>
                    </FormProvider>


                </section>
                <footer className="modal-card-foot" style={{ backgroundColor: '#00D1B2' }}>
                    <div className="buttons">
                        <button type="submit" className="button is-success" onClick={onSubmit} style={{ backgroundColor: '#2c3c5b', color: 'white' }}>Save</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default ModalEdit;
