import React, { useState } from 'react';
import axios from 'axios';

const EditDataForm = ({ tableName, data, onClose }) => {
    const [formData, setFormData] = useState(data);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:8000/api/tables/${tableName}/data/${formData.id}`, formData)
            .then(res => {
                console.log(res);
                onClose();
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl mb-4">Edit Data</h2>
                <form onSubmit={handleSubmit}>
                    {Object.keys(formData).map((key, index) => (
                        key !== 'id' && (
                            <div key={index} className="mb-4">
                                <label className="block text-gray-700">{key}</label>
                                <input
                                    type="text"
                                    name={key}
                                    className="w-full p-2 border border-gray-300 rounded mt-1"
                                    value={formData[key] || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )
                    ))}
                    <div className="flex justify-end">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
                        <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDataForm;
