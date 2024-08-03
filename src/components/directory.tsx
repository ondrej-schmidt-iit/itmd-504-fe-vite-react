import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import '../css/directory.css';

type Contact = {
    id: string;
    firstName: string;
    lastName: string;
    street: string;
    streetNumber: string;
    city: string;
    postalCode: string;
    email: string;
    phone: string;
    note: string;
};

const Directory: React.FC = () => {
    const {register, handleSubmit, reset} = useForm<Contact>();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_ITMD_504_BE_API_URL}/contacts`)
            .then((res) => res.json())
            .then((data) => setContacts(data))
            .catch((err) => console.error(err));
    }, []);

    const onSubmit = async (data: Contact) => {
        if (editingContact) {
            await fetch(`${import.meta.env.VITE_ITMD_504_BE_API_URL}/contacts/${editingContact.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });
            setContacts((prev) =>
                prev.map((contact) =>
                    contact.id === editingContact.id ? {...data, id: editingContact.id} : contact
                )
            );
            setEditingContact(null);
        } else {
            const response = await fetch(`${import.meta.env.VITE_ITMD_504_BE_API_URL}/contacts`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });
            const newContact = await response.json();
            setContacts((prev) => [...prev, newContact]);
        }
        reset();
    };

    const editContact = (contact: Contact) => {
        setEditingContact(contact);
        reset(contact);
    };

    const deleteContact = async (id: string) => {
        await fetch(`${import.meta.env.VITE_ITMD_504_BE_API_URL}/contacts/${id}`, {method: 'DELETE'});
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
    };

    const refreshContacts = async () => {
        const response = await fetch(`${import.meta.env.VITE_ITMD_504_BE_API_URL}/contacts`);
        const data = await response.json();
        setContacts(data);
    };

    return (
        <div className="container">
            <h2 className="directory-title">Contact Directory</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="form-label">First Name</label>
                        <input
                            className="form-input"
                            type="text"
                            {...register('firstName')}
                            placeholder="John"
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label">Last Name</label>
                        <input
                            className="form-input"
                            type="text"
                            {...register('lastName')}
                            placeholder="Doe"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                        <label className="form-label">Street</label>
                        <input
                            className="form-input"
                            type="text"
                            {...register('street')}
                            placeholder="Main Street"
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label">Street Number</label>
                        <input
                            className="form-input"
                            type="text"
                            {...register('streetNumber')}
                            placeholder="123"
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label">City</label>
                        <input
                            className="form-input"
                            type="text"
                            {...register('city')}
                            placeholder="New York"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="form-label">Postal Code</label>
                        <input
                            className="form-input"
                            type="text"
                            {...register('postalCode')}
                            placeholder="10001"
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            {...register('email')}
                            placeholder="john.doe@example.com"
                            required
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        className="form-input"
                        type="text"
                        {...register('phone')}
                        placeholder="(555) 555-5555"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Note</label>
                    <textarea
                        className="form-input"
                        {...register('note')}
                        placeholder="Additional notes"
                    ></textarea>
                </div>
                <div className="flex justify-between">
                    <button type="submit" className="btn">
                        {editingContact ? 'Update' : 'Add'}
                    </button>
                    <button type="button" onClick={() => reset()} disabled={!editingContact} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>

            <div className="divider"></div>

            <div className="table-container">
                <div className="table-header">
                    <h3 className="directory-title">Contacts List</h3>
                    <button onClick={refreshContacts} className="btn">Refresh</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Note</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {contacts.map((contact) => (
                            <tr key={contact.id}>
                                <td>{`${contact.firstName} ${contact.lastName}`}</td>
                                <td>{`${contact.street} ${contact.streetNumber}, ${contact.postalCode} ${contact.city}`}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phone}</td>
                                <td>{contact.note}</td>
                                <td className="table-actions">
                                    <button onClick={() => editContact(contact)} className="btn">Edit</button>
                                    <button onClick={() => deleteContact(contact.id)} className="btn-secondary">Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Directory;