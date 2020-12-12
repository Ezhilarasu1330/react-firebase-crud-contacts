import React, { useState, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import ContactForm from './ContactForm'

import firebaseDb from '../firebaseConfig';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Contacts = () => {

    const initialValues = {
        open: false,
        variant: "success",
        message: ''
    }

    var [toastr, setToastr] = useState(initialValues)
    var [contactObjects, setContactObjects] = useState({})
    var [currentId, setCurrentId] = useState('')

    useEffect(() => {
        firebaseDb.child('contacts').on('value', snapshot => {
            console.log('Contacts : ', snapshot.val());
            if (snapshot.val() != null)
                setContactObjects({
                    ...snapshot.val()
                })
            else
                setContactObjects({})
        })
    }, [])

    const addOrEdit = obj => {

        if (currentId == '')
            firebaseDb.child('contacts').push(obj, err => {
                if (err) {
                    console.log(err)
                    setToastr({
                        open: true,
                        variant: "error",
                        message: 'Conatact Not Added Successfully'
                    })
                }
                else {
                    setToastr({
                        open: true,
                        variant: "success",
                        message: 'Conatact Added Successfully'
                    })

                    setCurrentId('')
                }
            })

        else

            firebaseDb.child(`contacts/${currentId}`).set(obj, err => {
                if (err) {
                    console.log(err)
                    setToastr({
                        open: true,
                        variant: "error",
                        message: 'Conatact Not Updated.'
                    })
                }
                else {
                    setToastr({
                        open: true,
                        variant: "success",
                        message: 'Conatact Updated Successfully'
                    })

                    setCurrentId('')
                }
            })
    }

    const onDelete = key => {
        if (window.confirm('Are you sure to delete this record?')) {
            firebaseDb.child(`contacts/${key}`).remove(err => {
                if (err) {
                    console.log(err)
                    setToastr({
                        open: true,
                        variant: "error",
                        message: 'Conatact Not Deleted.'
                    })
                }
                else {
                    setToastr({
                        open: true,
                        variant: "success",
                        message: 'Conatact Deleted Successfully'
                    })

                    setCurrentId('')
                }
            })
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setToastr({
            open: false,
            variant: 'success',
            message: ''
        })
    };

    return (
        <>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4 text-center">Contact Book</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-md-5">
                    <ContactForm {...({ addOrEdit, currentId, contactObjects })} />
                </div>
                <div className="col-md-7">
                    <table className="table table-borderless table-stripped">
                        <thead className="thead-light">
                            <tr>
                                <th>Full Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(contactObjects).map(id => {
                                    return <tr key={id}>
                                        <td>{contactObjects[id].fullName}</td>
                                        <td>{contactObjects[id].mobile}</td>
                                        <td>{contactObjects[id].email}</td>
                                        <td>
                                            <a className="btn text-primary" onClick={() => { setCurrentId(id) }}>
                                                <i className="fas fa-pencil-alt"></i>
                                            </a>
                                            <a className="btn text-danger" onClick={() => { onDelete(id) }}>
                                                <i className="fas fa-trash-alt"></i>
                                            </a>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <Snackbar open={toastr.open} autoHideDuration={1500} onClose={handleClose}>
                <Alert onClose={handleClose} severity={toastr.variant}>
                    {toastr.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Contacts;
