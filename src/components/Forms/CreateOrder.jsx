import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from './Input';
import Swal from 'sweetalert2';

function FormOrder() {
    const methods = useForm();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const sitio = localStorage.getItem("Sitio");

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const [isDarkMode, setIsDarkMode] = useState(darkModeMediaQuery.matches);

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

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const currentDateTime = `${currentDate}T${currentTime}`;
        setFormData({ ...formData, createdAt: currentDateTime});
    }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        let inputValue = type === 'checkbox' ? checked : value;

        const firstDigit = value.substring(0, 1);
        const restOfNumber = value.substring(1);

        // Si el primer dígito es cero, establecer el valor como el resto del número
        if (firstDigit === '0' && name === 'price') {
            setFormData({ ...formData, [name]: restOfNumber });
        } else {
            setFormData({ ...formData, [name]: inputValue });
        }
    };

    const handleSubmit = methods.handleSubmit(async (e) => {

        try {
            const url = sitio === "Shop1" ? "/api/orders/" : "/api/ordersen/";
            const response = await api.post(url, formData);
            console.log(response);
            // Muestra una notificación de éxito con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'success',
                title: 'Order Created',
                text: "The order has been created successfully.",
                customClass: isDarkMode ? 'swal2-dark' : '',
                showCancelButton: true,
                confirmButtonText: 'Print',
                cancelButtonText: 'Back to Orders',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Navega a la página de inicio actual
                    navigate(`/pdf/fattura/${response.data.idOrder}`);
                } else {
                    navigate('/Orders');
                }
            });
        } catch (error) {
            // Muestra una notificación de error con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "The order could not be created. Please try again later.",
                timer: 2000, // Cierra automáticamente después de 3 segundos
                timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
            });
        }

    });

    return (
        <div className="container" style={{ margin: '30px auto', maxWidth: '1000px' }}>
            <div className="columns is-justify-content-center is-align-items-center">
                <div className="column is-8-tablet is-7-desktop is-6-widescreen">
                    {/* Encabezado con botón "Back to Home" e icono de home */}
                    <div className="is-flex is-justify-content-space-between">
                        <h2 className="title is-2">Crea ordine</h2>
                        <Link to="/Orders" className="button is-link is-small px-5" style={{ height: '50px' }}>
                            <span className="icon">
                                <i className="fas fa-home"></i>
                            </span>
                            <span>Home</span>
                        </Link>
                    </div>

                    <FormProvider {...methods}>
                        <form onSubmit={e => e.preventDefault()} noValidate className="box p-5">
                            {/* Formulario */}
                            <div className="field mb-4 is-grouped" style={{ justifyContent: 'space-between' }}>
                                <Input
                                    label="Name"
                                    type="text"
                                    name="nameCustomer"
                                    placeholder="Name"
                                    value={formData.nameCustomer || ''}
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
                                        value={formData.surnameCustomer || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="field mb-4">
                                <Input
                                    type="text"
                                    label="Phone Number"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber || ''}
                                    onChange={handleChange}
                                    pattern="[0-9]*"
                                />
                            </div>

                            <div className="field mb-4">
                                <Input
                                    label="Model"
                                    type="text"
                                    name="modelPhone"
                                    placeholder="Model"
                                    value={formData.modelPhone || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field mb-4">
                                <Input
                                    label="Defect"
                                    type="text"
                                    name="defect"
                                    placeholder="Defect"
                                    value={formData.defect || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Campos de "Pezzo" y "Costo" en el mismo div */}
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
                                        value={formData.pieceName || ''}
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
                                        value={formData.price || 0}
                                        onChange={handleChange}
                                        min={0}
                                    />
                                </div>
                            </div>

                            {/* Campos de selección */}
                            <div className="field mb-4">
                                <div className="columns is-variable is-8">
                                    <div className="column">
                                        <label className="label is-small">Status</label>
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select
                                                    name="status"
                                                    value={formData.status || ''}
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
                                                    value={formData.shipped || 'No'}
                                                    onChange={handleChange}
                                                >
                                                    <option value="No">No</option>
                                                    <option value="Mag">Arr</option>
                                                    <option value="Si">Si</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Campo de notas */}
                            <div className="field mb-4">
                                <label className="label is-small">Note</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        name="notes"
                                        value={formData.notes || ''}
                                        onChange={handleChange}
                                        placeholder="Enter notes..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="field mb-4 is-grouped is-justify-content-space-between">
                                <div className="control ml-1">
                                    <label className="checkbox">
                                        Guarantee
                                        <input
                                            type="checkbox"
                                            name="guarantee"
                                            checked={formData.guarantee || false}
                                            onChange={handleChange}
                                            className='ml-2'
                                        />
                                    </label>
                                </div>

                                <div className="control mr-1">
                                    <label className="checkbox">
                                        Client Advised
                                        <input
                                            type="checkbox"
                                            name="clientAdviser"
                                            checked={formData.clientAdviser || false}
                                            onChange={handleChange}
                                            className='ml-2'
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Botón de envío */}
                            <div className="m-3 columns is-justify-content-center is-align-items-center">
                                <button type="submit" onClick={handleSubmit} className="button is-link px-5">Save</button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}

export default FormOrder;