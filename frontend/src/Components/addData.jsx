import React, { useState } from 'react';
import axios from 'axios';

const AddDataForm = ({ tableName, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        month: '',
        fee: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        for (let key in formData) {
            formDataObj.append(key, formData[key]);
        }
        if (selectedFile) {
            formDataObj.append('image', selectedFile);
        }

        axios.post(`http://localhost:8000/api/tables/${tableName}/data`, formDataObj)
            .then(res => {
                console.log(res);
                onClose();
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl mb-4">Add Data to {tableName}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <input
                            type="text"
                            name="description"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Month</label>
                        <input
                            type="text"
                            name="month"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={formData.month}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Fee</label>
                        <input
                            type="text"
                            name="fee"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={formData.fee}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Image</label>
                        <input
                            type="file"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">Submit</button>
                        <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDataForm;
