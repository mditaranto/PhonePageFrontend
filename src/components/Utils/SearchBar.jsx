import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/SearchBar.css";

function Searchbar({ originalOrders, setOrders, navTab }) {
    const [input, setInput] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (navTab !== "pane-1") {
            setOrders(originalOrders);
        }
    }, [navTab, originalOrders, setOrders]);

    const handleSearch = (e) => {
        setInput(e.target.value);

        if (e.target.value === "") {
            setOrders(originalOrders);
            return;
        }

        const filteredOrders = originalOrders.filter((order) => {
            const lowerCaseInput = input.toLowerCase();

            const fullName = `${order.nameCustomer} ${order.surnameCustomer}`.toLowerCase();
            const modelPhone = order.modelPhone.toLowerCase();
            const phoneNumber = order.phoneNumber.toLowerCase();

            return fullName.includes(lowerCaseInput) ||
                modelPhone.includes(lowerCaseInput) ||
                phoneNumber.includes(lowerCaseInput);
        });

        setOrders(filteredOrders);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);

        if (date) {
            const filteredOrders = originalOrders.filter((order) => {
                const orderDate = new Date(order.createdAt);
                return orderDate.toDateString() === date.toDateString();
            });

            setOrders(filteredOrders);
        } else {
            setOrders(originalOrders);
        }
    };

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                type="text"
                placeholder="Search..."
                value={input}
                onChange={handleSearch}
            />

            {/* Solo muestra el icono de calendario y DatePicker si navTab es "Orders" */}
            {navTab === "pane-1" && (
                <>
                    <i className="fas fa-calendar-alt calendar-icon"></i>
                    <DatePicker
                        className="ml-1 mb-1"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        placeholderText="Date"
                        dateFormat="dd/MM/yyyy"
                    />
                </>
            )}
        </div>
    );
}

export default Searchbar;
