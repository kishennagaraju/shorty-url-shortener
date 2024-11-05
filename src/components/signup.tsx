import { useEffect, useState } from "react";
import useFetch from '@/hooks/use-fetch.js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { BeatLoader } from "react-spinners";
import Error from "@/components/error.tsx";
import * as Yup from 'yup';
import { signup } from '@/db/apiAuth.js';
import { useNavigate, useSearchParams } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();
    const longLink = searchParams.get('createNew');
    const [ errors, setErrors ] = useState([]);
    const [ formData, setFormData ] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: null
    });

    const handleInputChange = ( e ) => {
        const { name, value, files } = e.target;

        setFormData(( previousState ) => ({
            ...previousState,
            [name]: files ? files[0] : value
        }))
    }

    const { loading, error, fn: fnSignUp, data } = useFetch(signup, formData);

    useEffect(() => {
        if ( error === null && data ) {
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
        }
    }, [ error, loading ]);

    const handleSignUp = async () => {
        setErrors([]);
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required("Name is Required."),
                email: Yup.string().email("Invalid Email").required("Email is required."),
                password: Yup.string().min(5, "Password should have minimum 6 characters").required("Password is required."),
                profile_pic: Yup.mixed().required("Profile Picture is required.")
            });

            await schema.validate(formData, { abortEarly: false });
            await fnSignUp();
        } catch ( e ) {
            const newErrors = {};
            if ( error?.inner ) {
                error.inner.forEach(( err ) => {
                    newErrors[err.path] = err.message;
                });

                setErrors(newErrors);
            } else {
                setErrors({ api: error.message });
            }
        }
    }

    return (
      <Card>
          <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Sign Up if you are a new user.</CardDescription>
              {error && <Error message={error.message}/>}
          </CardHeader>
          <CardContent className={"space-y-2"}>
              <div className={"space-y-1"}>
                  <Input onChange={handleInputChange} name="name" type="text" placeholder="Enter Full Name"/>
                  {errors.name && <Error message={errors.name}/>}
              </div>
              <div className={"space-y-1"}>
                  <Input onChange={handleInputChange} name="email" type="email" placeholder="Enter Email"/>
                  {errors.email && <Error message={errors.email}/>}
              </div>
              <div className={"space-y-1"}>
                  <Input onChange={handleInputChange} name="password" type="password" placeholder="Enter Password"/>
                  {errors.password && <Error message={errors.password}/>}
              </div>
              <div className={"space-y-1"}>
                  <Input onChange={handleInputChange} name="profile_pic" type="file" accept="image/*"/>
                  {errors.profile_pic && <Error message={errors.profile_pic}/>}
              </div>
          </CardContent>
          <CardFooter>
              <Button onClick={handleSignUp}>{loading ?
                <BeatLoader size={10} color="#36d7b7"/> : "Create Account"}</Button>
          </CardFooter>
      </Card>
    )
}

export default SignUp;