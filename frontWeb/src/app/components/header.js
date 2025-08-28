"use client";

import { useState } from "react";
import Sidebar from "./barreralateral";
import "../../styles/header.css";
import "../../styles/barra.css";
import "react-calendar/dist/Calendar.css";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [date, setDate] = useState(new Date());


    return (
        <>
            <header className="header">
                <div className="left">
                    <div>
                        <button className="menu-btn" onClick={() => setOpen(!open)}>
                        </button>
                    </div>

                    <div>
                        <button className="calendar-btn">
                            {date.toLocaleString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
                        </button>
                    </div>

                    <div className="search-bar">
                        <div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="search-input"
                            />
                        </div>
                        <button className="search-btn"></button>
                    </div>

                </div>

                <div className="right">
                    <div>
                        <button className="icon-notificaciones"></button>
                    </div>
                    <div>
                        <button className="icon-ajustes"></button>
                    </div>

                    <div className="user">
                        <a href="../users/profile" className="user-link">
                            <div>
                                <button className="icon-avatar"></button>
                            </div>
                            <div className="user-info">
                                <span>Carol Marentes</span>

                            </div>
                        </a>
                    </div>
                </div>
            </header>


            {open && <div className="overlay" onClick={() => setOpen(false)}></div>}


            <div className={`sidebar ${open ? "open" : ""}`}>
                <Sidebar />
            </div>


        </>
    );
}
