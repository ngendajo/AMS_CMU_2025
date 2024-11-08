import React, { useState, useEffect } from 'react';
import { fetchEap, createEap, updateEap, deleteEap } from '../../services/eapservice';
import useAuth from "../../hooks/useAuth";
import DynamicTable from "../pages/dinamicTable/DynamicTable";
import { BiEditAlt, BiSave } from "react-icons/bi";

export default function Eaps() {
    let { auth } = useAuth();
    const [eap, setEap] = useState([]);
    const [creating, setCreating] = useState(false); 
    const [editing, setEditing] = useState(null); // Track which timeslot is being edited
    const [formData, setFormData] = useState({
        last_name: "",
        first_name: "",
        school: "",
        eap_class: ""
    });
   
    useEffect(() => {
        fetchEap(auth).then(response => setEap(response.data));
    }, [auth]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this student?");
        if (confirmed) {
            deleteEap(auth, id)
                .then(() => {
                    setEap(eap.filter(item => item.id !== id));
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    };

    const handleEdit = (id) => {
        setEditing(id);
    };

    const handleSave = (id) => {
        const eapToUpdate = eap.find(st => st.id === id);
        updateEap(auth, id, {
            last_name: eapToUpdate.last_name,
            first_name: eapToUpdate.first_name,
            school: eapToUpdate.school,
            eap_class: eapToUpdate.eap_class
        })
            .then(() => {
                setEditing(null); // Exit editing mode after saving
                fetchEap(auth).then(response => setEap(response.data));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const handleInputChange = (id, key, value) => {
        setEap(preveap =>
            preveap.map(st =>
                st.id === id ? { ...st, [key]: value } : st
            )
        );
    };

    // Transform the timeslots data
    const transformedEap = eap
    .map(({ id, last_name,first_name,school,eap_class},index) => {
        
        return {
            "#":index+1,
            "Last Name": editing === id ? (
                <input
                    type="text"
                    name="last_name"
                    value={last_name}
                    onChange={(e) => handleInputChange(id, 'last_name', e.target.value)}
                />
            ) : (
                last_name
            ),
            "First Name": editing === id ? (
                <input
                    type="text"
                    name="first_name"
                    value={first_name}
                    onChange={(e) => handleInputChange(id, 'first_name', e.target.value)}
                />
            ) : (
                first_name
            ),
            "School": editing === id ? (
                <input
                    type="text"
                    name="school"
                    value={school}
                    onChange={(e) => handleInputChange(id, 'school', e.target.value)}
                />
            ) : (
                school
            ),
            "EAP Class": editing === id ? (
                <input
                    type="text"
                    name="eap_class"
                    value={eap_class}
                    onChange={(e) => handleInputChange(id, 'eap_class', e.target.value)}
                />
            ) : (
                eap_class
            ),
            edit: editing === id ? (
                <span
                    onClick={() => handleSave(id)}
                    style={{ cursor: 'pointer' }}
                >
                    <BiSave className='icon' />
                </span>
            ) : (
                <span
                    onClick={() => handleEdit(id)}
                    style={{ cursor: 'pointer' }}
                >
                    <BiEditAlt className='icon' />
                </span>
            )/* ,
            delete: (
                <span
                    onClick={() => handleDelete(id)}
                    style={{ cursor: 'pointer' }}
                >
                    Delete
                </span>
            ) */
        };
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createEap(auth, formData)
            .then(response => {
                console.log('Created successfully', response.data);
                setFormData({
                    last_name: "",
                    first_name: "",
                    school: "",
                    eap_class: ""
                });
                fetchEap(auth).then(response => setEap(response.data));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}
            >
                <h2>Students in English Access Program</h2>
                {!creating?
                    <button
                        style={
                            {
                                padding: '10px 20px',
                                margin: '5px',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '16px',
                                backgroundColor: '#002F6C',
                            }
                        }
                        onClick={() => setCreating(!creating)}  // Call filterToday on button click
                    >
                        Create New
                    </button>:
                    <form className='formelement' onSubmit={handleSubmit}>
                    
                        <label htmlFor="first_name">Enter First Name</label>
                        <input
                            className='credentials'
                            type="text"
                            id="first_name"
                            name="first_name"
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="last_name">Enter Last Name</label>
                        <input
                            className='credentials'
                            type="text"
                            id="last_name"
                            name="last_name"
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="school">Enter School Name</label>
                        <input
                            className='credentials'
                            type="text"
                            id="school"
                            name="school"
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="eap_class">Enter EAP Class Name</label>
                        <input
                            className='credentials'
                            type="text"
                            id="eap_class"
                            name="eap_class"
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="loginbutton">
                            <button className='submitbuton' type="submit">Save</button> 
                        </label>
                        <button
                            style={
                                {
                                    padding: '10px 20px',
                                    margin: '5px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    backgroundColor: '#002F6C',
                                }
                            }
                            onClick={() => setCreating(!creating)}  // Call filterToday on button click
                        >
                            Cancel
                        </button>
                    </form>
                }
            </div>
            
            
            <h2>Available EAP Students</h2>
            <DynamicTable mockdata={transformedEap} />
        </div>
    );
}

