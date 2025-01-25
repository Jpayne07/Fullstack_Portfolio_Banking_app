import React, {useState} from 'react'
import Nav from '../Components/Nav'
import bank_image from '../images/bank_image.jpg'
import illustrated_pixel_art_desktop_wallpaper from '../images/illustrated_pixel_art_desktop_wallpaper.svg'
import '../App.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';




function Login({setUser}) {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);


    function handleSubmit(username, password) {
        fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        })
          .then((r) => {
            if (r.ok) {
              r.json().then((user) => {
                console.log(user);
                // setUser(user);
                navigate('/');
              });
            } else {
              r.json().then((err) => {
                setErrors([err.message || "Invalid login credentials. Please try again."]);
              });
            }
          })
          .catch((err) => {
            setErrors([err.message || "Network error. Please try again later."]);
          })
        //   .finally(() => {
        //     setSubmitting(false);  // Ensure submission is completed
        //   });
      }


  return (
    <main>
        <Nav />
        <div className='login_wrapper'>
            {/* <div className='login_image_wrapper'>
                <img src={illustrated_pixel_art_desktop_wallpaper}/>
            </div> */}
            <div className='background_wrapper' id='login'>
            <div className='_wrapper' id='login'>
            <div className='login_content'>
                    <div className='login_header'><h2>Login</h2>
                    <p>Don't have an account? <a href='/signup' id = "signup">Signup</a>
                    </p>
                    </div>
                    
                    <Formik
                        initialValues={{ username: '', password: '' }}
                        validate={values => {
                        const errors = {};
                        if (!values.username) {
                            errors.username = 'Required';
                        }
                        if (!values.password) {
                            errors.password = 'Required';
                        }
                        return errors;
                        }}
                        onSubmit={(values) => {
                        handleSubmit(values.username, values.password);
                        }}
                    >
                        {({ isSubmitting }) => (
                        <Form className='login_form_body'>
                            
                            {/* <div className='form_row'> */}
                                <div className='form_row'>
                                    <label className="formik_labels">Username: </label>
                                    <Field type="text" name="username" className="formik_fields"/>
                                    <ErrorMessage name="username" component="div" id='form_error'/>
                                </div>
                                <div className='form_row'>
                                    <label className="formik_labels">Password: </label>
                                    <Field type="password" name="password" className="formik_fields"/>
                                    <ErrorMessage name="password" component="div" id='form_error'/>
                                </div>
                            
                            
                            <div className='form_row'>
                            <button type="submit" disabled={isSubmitting} id='login_button'>
                            Submit
                            </button>
                            <p onClick={()=>{handleSubmit('Jacob','hi')}}><span id = 'continue_as_guest'>OR</span> Continue as guest</p>
                            </div>
                        </Form>
                        )}
                    </Formik>

            </div>
            </div>
            </div>
        </div>
        
    
    </main>
  )
}

export default Login