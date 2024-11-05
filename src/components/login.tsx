import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch.js";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { BeatLoader } from "react-spinners";
import Error from "@/components/error.tsx";
import * as Yup from "yup";
import { login } from "@/db/apiAuth.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context/url-context.tsx";

const Login = () => {
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();
    const longLink = searchParams.get("createNew");
    const [ errors, setErrors ] = useState({});
    const { fetchUser } = UrlState();
    const [ formData, setFormData ] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = ( e ) => {
        const { name, value } = e.target;

        setFormData(( previousState ) => ({
            ...previousState,
            [name]: value,
        }));
    };

    const { loading, error, fn: fnLogin, data } = useFetch(login, formData);

    useEffect(() => {
        if ( error === null && data ) {
            fetchUser();
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
        }
    }, [ error, data ]);

    const handleLogin = async () => {
        setErrors([]);
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                .email("Invalid Email")
                .required("Email is required."),
                password: Yup.string()
                .min(6, "Password should have minimum 6 characters")
                .required("Password is required."),
            });

            await schema.validate(formData, { abortEarly: false });
            await fnLogin();
        } catch ( e ) {
            const newErrors = {};

            e?.inner?.forEach(( error ) => {
                newErrors[error.path] = error.message;
            });

            setErrors(newErrors);
        }
    };

    return (
      <Card>
          <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login if you are a registered user.</CardDescription>
              {error && <Error message={error.message}/>}
          </CardHeader>
          <CardContent className={"space-y-2"}>
              <div className={"space-y-1"}>
                  <Input
                    onChange={handleInputChange}
                    name='email'
                    type='email'
                    placeholder='Enter Email'
                  />
                  {errors.email && <Error message={errors.email}/>}
              </div>
              <div className={"space-y-1"}>
                  <Input
                    onChange={handleInputChange}
                    name='password'
                    type='password'
                    placeholder='Enter Password'
                  />
                  {errors.password && <Error message={errors.password}/>}
              </div>
          </CardContent>
          <CardFooter>
              <Button onClick={handleLogin}>
                  {loading ? <BeatLoader size={10} color='#36d7b7'/> : "Login"}
              </Button>
          </CardFooter>
      </Card>
    );
};

export default Login;
