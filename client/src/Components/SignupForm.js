import React, {useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import AppContext from '../AppContext';




function SignupForm({handleSubmit}) {
  
    const navigate = useNavigate();
    const handleLoginGithub = () => {
        window.location.href = `${API_URL}/api/login-github`; // Ensure the URL matches your Flask app's URL
      };

      const { mockLogin, API_URL } = useContext(AppContext);

    useEffect(()=>{
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParams = urlParams.get("code")
      },[handleLoginGithub])

      
    

    const FormSchema = yup.object().shape({
        password: yup
            .string()
            .min(2, 'Password must be 2 characters long')
            .matches(/[a-z]/, 'Password requires a lowercase letter')
            .matches(/[A-Z]/, 'Password requires an uppercase letter')
            .matches(/[^\w]/, 'Password requires a symbol'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Must match "password" field value'),
        username: yup
            .string()
            .min(5, 'username must be 5 characters long')
            .matches(/[a-z]/, 'username requires a lowercase letter')
            .matches(/[A-Z]/, 'username requires an uppercase letter'),
        confirmUsername: yup
            .string()
            .oneOf([yup.ref('username'), null], 'Must match "username" field value'),
        });

  return (
    <Formik
    initialValues={{ username: '', password: '', confirmPassword: '', confirmUsername: '' }}
    validationSchema={FormSchema}
    onSubmit={(values, { setSubmitting }) => {
    handleSubmit(values.username, values.password, setSubmitting);
    }}
>
    {({ isSubmitting, errors }) => (
      
    <Form className='login_form_body'>
        
        {/* <div className='form_row'> */}
        <div className='form_fields'>
            <div className='form_row'>
                <label className="formik_labels">Username: </label>
                <Field type="text" name="username" className="formik_fields"/>
                {errors.username && <p>{errors.username}</p>}
            </div>
            <div className='form_row'>
                <label className="formik_labels">Password: </label>
                <Field type="password" name="password" className="formik_fields"/>
                {errors.password && <p>{errors.password}</p>}
            </div>
            <div className='form_row'>
                <label className="formik_labels">Confirm U: </label>
                <Field type="text" name="confirmUsername" className="formik_fields"/>
                {errors.confirmUsername && <p>{errors.confirmUsername}</p>}
            </div>
            <div className='form_row'>
                <label className="formik_labels">Confirm P: </label>
                <Field type="password" name="confirmPassword" className="formik_fields"/>
                {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            </div>
          </div>
        
        
        <div className='form_row' style={{justifyContent:"center"}}>
        <button type="submit" disabled={isSubmitting} id='login_button'>
        Submit
        </button>
        <p onClick={()=>{mockLogin('Jacob','hi', navigate)}} style={{width:"100%", textAlign:"center"}}><span id = 'continue_as_guest'>OR</span> Continue as guest</p>
        <button id="github_Login" onClick={handleLoginGithub}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 1792 1792"
          >
            <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
            </svg>
          <span id='github_span'>Signup With GitHub</span>
        </button>
        </div>
    </Form>
    )}
</Formik>
  )
}

export default SignupForm