import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddDataForm from '../Components/addData';
import EditDataForm from '../Components/editData';

const Dashboard = () => {
    const navigate = useNavigate();
    const initialColumnState = { name: "", type: "VARCHAR(255)", pk: false, nn: false, uq: false, binary: false, un: false, zf: false, ai: false };
    const [tableName, setTableName] = useState("");
    const [columns, setColumns] = useState([initialColumnState]);
    const [tables, setTables] = useState([]);
    const [showTableList, setShowTableList] = useState(false);
    const [showAddDataForm, setShowAddDataForm] = useState(false);
    const [currentTable, setCurrentTable] = useState("");
    const [tableData, setTableData] = useState([]);
    const [showData, setShowData] = useState(false);
    const [editingData, setEditingData] = useState(null);

    const columnTypes = ["VARCHAR(255)", "INT", "TEXT", "DATE", "DATETIME", "BOOLEAN", "FLOAT", "DOUBLE", "DECIMAL", "BLOB", "CHAR(1)", "TINYINT", "SMALLINT", "MEDIUMINT", "BIGINT", "TIME", "YEAR", "MEDIUMTEXT", "LONGTEXT", "POINT"];

    useEffect(() => {
        const checkIp = async () => {
            try {
                const clientIpResponse = await axios.get('https://api.ipify.org?format=json');
                const clientIp = clientIpResponse.data.ip;

                const allowedIpResponse = await axios.get('http://localhost:8000/api/allowedIp');
                const allowedIp = allowedIpResponse.data.allowedIp;

                if (clientIp !== allowedIp) {
                    navigate('/'); // Redirect to home or another route if IP doesn't match
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkIp();
    }, [navigate]);

    const addColumn = () => {
        setColumns([...columns, initialColumnState]);
    };

    const handleColumnChange = (index, key, value) => {
        const newColumns = [...columns];
        newColumns[index][key] = value;
        setColumns(newColumns);
    };

    const removeColumn = (index) => {
        const newColumns = [...columns];
        newColumns.splice(index, 1);
        setColumns(newColumns);
    };

    const createTable = () => {
        axios.post("http://localhost:8000/api/createTable", { tableName, columns })
            .then(res => {
                console.log(res);
                showTables();
                setTableName("");
                setColumns([initialColumnState]);
            })
            .catch(err => console.error(err));
    };

    const showTables = () => {
        axios.get("http://localhost:8000/api/tables")
            .then((response) => {
                setTables(response.data);
                setShowTableList(true);
            })
            .catch(err => console.error(err));
    };

    const deleteTable = (tableName) => {
        axios.delete(`http://localhost:8000/api/tables/${tableName}`)
            .then(res => {
                console.log(res);
                showTables();
            })
            .catch(err => console.error(err));
    };

    const showAddDataFormForTable = (tableName) => {
        setCurrentTable(tableName);
        setShowAddDataForm(true);
    };

    const showDataForTable = (tableName) => {
        axios.get(`http://localhost:8000/api/tables/${tableName}/data`)
            .then(res => {
                setTableData(res.data);
                setCurrentTable(tableName);
                setShowData(true);
            })
            .catch(err => console.error(err));
    };

    const hideDataForTable = () => {
        setShowData(false);
        setTableData([]);
    };

    const deleteData = (id) => {
        axios.delete(`http://localhost:8000/api/tables/${currentTable}/data/${id}`)
            .then(res => {
                console.log(res);
                showDataForTable(currentTable);
            })
            .catch(err => console.error(err));
    };

    const editData = (row) => {
        setEditingData(row);
    };

    const closeEditForm = () => {
        setEditingData(null);
        showDataForTable(currentTable);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="container mx-auto">
                <div className="bg-white shadow-md rounded p-6 mb-6">
                    <header className="bg-blue-600 text-white text-center py-4">
                        <h1 className="text-4xl font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>Dash-Board</h1>
                    </header>
                    <h2 className="text-2xl font-semibold mb-4">Create Table</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">Table Name:</label>
                        <input type='text' className="w-full p-2 border border-gray-300 rounded mt-1" value={tableName} onChange={(e) => setTableName(e.target.value)} />
                    </div>
                    {columns.map((col, index) => (
                        <div key={index} className="bg-gray-50 p-4 mb-4 rounded">
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <div>
                                    <label className="block text-gray-700">Column Name:</label>
                                    <input type='text' className="w-full p-2 border border-gray-300 rounded mt-1" value={col.name} onChange={(e) => handleColumnChange(index, "name", e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Type:</label>
                                    <select className="w-full p-2 border border-gray-300 rounded mt-1" value={col.type} onChange={(e) => handleColumnChange(index, "type", e.target.value)}>
                                        {columnTypes.map((type, typeIndex) => (
                                            <option key={typeIndex} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex items-center">
                                    <input type='checkbox' className="mr-2" checked={col.pk} onChange={(e) => handleColumnChange(index, "pk", e.target.checked)} />
                                    <label className="text-gray-700">Primary Key</label>
                                </div>
                                <div className="flex items-center">
                                    <input type='checkbox' className="mr-2" checked={col.nn} onChange={(e) => handleColumnChange(index, "nn", e.target.checked)} />
                                    <label className="text-gray-700">Not Null</label>
                                </div>
                                <div className="flex items-center">
                                    <input type='checkbox' className="mr-2" checked={col.uq} onChange={(e) => handleColumnChange(index, "uq", e.target.checked)} />
                                    <label className="text-gray-700">Unique</label>
                                </div>
                                <div className="flex items-center">
                                    <input type='checkbox' className="mr-2" checked={col.binary} onChange={(e) => handleColumnChange(index, "binary", e.target.checked)} />
                                    <label className="text-gray-700">Binary</label>
                                </div>
                                <div className="flex items-center">
                                    <input type='checkbox' className="mr-2" checked={col.un} onChange={(e) => handleColumnChange(index, "un", e.target.checked)} />
                                    <label className="text-gray-700">Unsigned</label>
                                </div>
                                <div className="flex items-center">
                                    <input type='checkbox' className="mr-2" checked={col.zf} onChange={(e) => handleColumnChange(index, "zf", e.target.checked)} />
                                    <label className="text-gray-700">Zero Fill</label>
                                </div>
                                <div className="flex items-center">
                                    <input type='checkbox' className="mr-2" checked={col.ai} onChange={(e) => handleColumnChange(index, "ai", e.target.checked)} />
                                    <label className="text-gray-700">Auto Increment</label>
                                </div>
                            </div>
                            {index > 0 && (
                                <button onClick={() => removeColumn(index)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Remove Column</button>
                            )}
                        </div>
                    ))}
                    <button onClick={addColumn} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Add Column</button>
                    <button onClick={createTable} className="bg-green-500 text-white px-4 py-2 rounded">Create Table</button>
                </div>
                <div className="bg-white shadow-md rounded p-6">
                    <h2 className="text-2xl font-semibold mb-4">Show Tables</h2>
                    <div className="flex">
                        <button onClick={showTables} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mr-2">Show Tables</button>
                        <button onClick={() => setShowTableList(false)} className="bg-gray-500 text-white px-4 py-2 rounded mb-4">Hide Tables</button>
                    </div>
                    {showTableList && tables.map((table, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="text-xl font-semibold">{Object.values(table)[0]}</h3>
                            <button onClick={() => showAddDataFormForTable(Object.values(table)[0])} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Add Data</button>
                            <button onClick={() => showDataForTable(Object.values(table)[0])} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Show Data</button>
                            <button onClick={() => deleteTable(Object.values(table)[0])} className="bg-red-500 text-white px-4 py-2 rounded">Delete Table</button>
                            {showData && currentTable === Object.values(table)[0] && (
                                <>
                                    <button onClick={hideDataForTable} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Hide Data</button>
                                    <div className="mt-4">
                                        {tableData.length > 0 ? (
                                            <table className="min-w-full bg-white">
                                                <thead>
                                                    <tr>
                                                        {Object.keys(tableData[0]).map((key, index) => (
                                                            <th key={index} className="py-2">{key}</th>
                                                        ))}
                                                        <th className="py-2">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableData.map((row, index) => (
                                                        <tr key={index}>
                                                            {Object.values(row).map((value, index) => (
                                                                <td key={index} className="py-2 border-t">{value}</td>
                                                            ))}
                                                            <td className="py-2 border-t">
                                                                <button onClick={() => editData(row)} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Edit</button>
                                                                <button onClick={() => deleteData(row.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>No data available</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {showAddDataForm && (
                <AddDataForm
                    tableName={currentTable}
                    onClose={() => setShowAddDataForm(false)}
                />
            )}
            {editingData && (
                <EditDataForm
                    tableName={currentTable}
                    data={editingData}
                    onClose={closeEditForm}
                />
            )}
        </div>
    );
}

export default Dashboard;
