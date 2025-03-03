import React, { useState, useContext, useEffect} from 'react'
import { Formik, Form, Field} from 'formik';
import AppContext from '../AppContext';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';



function AddNewAccountForm() {
    

    const [holdSuggest, setHoldSuggest] = useState('')
    const {handleNewAccountSubmission, errors, errorState, setLoading} = useContext(AppContext)
    const navigate = useNavigate()
    const [banks, setBanks] = useState([])
    const bank_names = banks.filter(bank=>{
        return bank.name.toLowerCase().includes(holdSuggest.toLowerCase())
    })
    
    useEffect(() => {
        fetch(`/api/banks`,{
          method: 'GET',
          credentials: 'include'
        })
        .then((r) => r.json())
        .then(banks => {
          setBanks(banks);
      }).catch(error => {
        console.log("Error in fetching banks", error)
        setLoading(false);
        
      });
    }, []);
    const FormSchema = yup.object().shape({
        account_value: yup
            .number().min(1, 'Account value must be at least 1 characters long'),
        bank_name: yup
            .string()
            .min(5, 'bank must be 5 characters long')
            .matches(/[a-z]/, 'username requires a lowercase letter')
            .matches(/[A-Z]/, 'username requires an uppercase letter'),
        account_type: yup
            .string()
            .matches(/^(Checking|Savings)$/, "Account type should be 'Checking' or 'Savings'"),
        cardNumber: yup.string()
            .matches(/^\d+$/, 'Must contain only digits')
            .length(9, 'Must be at least 9 characters long')

        });

  return (
    <div>
    <Formik
    initialValues={{ bank_name: '', account_value: '', account_type: 'Checking', cardNumber: 0 }}
    validationSchema={FormSchema}
    onSubmit={(values, { setSubmitting }) => {
        handleNewAccountSubmission(values.bank_name, values.account_value, values.account_type, parseInt(values.cardNumber), setSubmitting, navigate)
        
    }}
>   
    {({ isSubmitting, errors, handleChange }) => (
      
    <Form className='login_form_body'>
        
        {/* <div className='form_row'> */}
        <div className='form_fields'>
            <div className='form_row'>
                <label className="formik_labels" id = "accountAdd">Bank Name: </label>
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
                <label className="formik_labels" id = "accountAdd">Account Value: </label>
                <Field type="text" name="account_value" className="formik_fields"/>
                {errors.account_value && <p>{errors.account_value}</p>}
            </div>
            <div className='form_row'>
                <label className="formik_labels" id = "accountAdd">Account Type: </label>
                <Field as="select"  name="account_type" className="formik_fields">
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                </Field>
                {errors.account_type && <p>{errors.account_type}</p>}
            </div>
            <div className='form_row'>
                <label className="formik_labels" id = "accountAdd">Card Number</label>
                <Field type ="text" name="cardNumber" className="formik_fields"/>
                {errors.cardNumber && <p>{errors.cardNumber}</p>}
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
    {errorState?errors:null}
</div>
  )
}

export default AddNewAccountForm