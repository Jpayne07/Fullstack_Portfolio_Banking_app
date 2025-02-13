import React, {useEffect, useState, useContext} from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import AppContext from '../AppContext';

import * as yup from 'yup';



function AddNewAccountForm({handleSubmit}) {
    const [holdSuggest, setHoldSuggest] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const { loading, banks } = useContext(AppContext)
    const bank_names = banks.filter(bank=>{
        return bank.name.toLowerCase().includes(holdSuggest.toLowerCase())
    })
    console.log(bank_names)
    const FormSchema = yup.object().shape({
        account_value: yup
            .number()
            .min(2, 'Password must be 2 characters long'),
        bank_name: yup
            .string()
            .min(5, 'bank must be 5 characters long')
            .matches(/[a-z]/, 'username requires a lowercase letter')
            .matches(/[A-Z]/, 'username requires an uppercase letter'),
        account_type: yup
            .string()
            .matches(/^(Checking|Savings)$/, "Account type should be 'Checking' or 'Savings'")

        });

  return (
    <Formik
    initialValues={{ bank_name: '', account_value: 0, account_type: '' }}
    validationSchema={FormSchema}
    onSubmit={(values) => {
    handleSubmit(values.bank_name, values.account_value, values.account_type);
    }}
>
    {({ isSubmitting, errors, handleChange }) => (
      
    <Form className='login_form_body'>
        
        {/* <div className='form_row'> */}
        <div className='form_fields'>
            <div className='form_row'>
                <label className="formik_labels">Bank Name: </label>
                <Field
                as="input"
                type="text" 
                name="bank_name" 
                className="formik_fields" 
                list="bankList"
                onChange={(e)=>{
                  handleChange(e)
                  setHoldSuggest(e.target.value)}}
                  />
                
                <datalist id="bankList">
                {bank_names.map((bank, key) =>
                  <option key={key} value={bank.name} />
                )}
                </datalist>
                {errors.bank_name && <p>{errors.bank_name}</p>}
            </div>
            <div className='form_row'>
                <label className="formik_labels">Account Value: </label>
                <Field type="text" name="account_value" className="formik_fields"/>
                {errors.account_value && <p>{errors.account_value}</p>}
            </div>
            <div className='form_row'>
                <label className="formik_labels">Account Type: </label>
                <Field type="text" name="account_type" className="formik_fields"/>
                {errors.account_type && <p>{errors.account_type}</p>}
            </div>
          </div>
        
        
        <div className='form_row' style={{justifyContent:"center"}}>
        <button type="submit" disabled={isSubmitting} id='login_button'>
        Submit
        </button>
      
        </div>
    </Form>
    )}
</Formik>
  )
}

export default AddNewAccountForm