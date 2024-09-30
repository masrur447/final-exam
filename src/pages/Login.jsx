import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "./../feature/UserSlice";
import { signInSchema } from "./../validation/Index";

const Login = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signInSchema,
    onSubmit: (values) => login(values),
  });

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password).then(
        ({ user }) => {
          if (!user.emailVerified) {
            toast.error("Please verify your email");
          } else {
            dispatch(setUser(user));
            toast.success("Login Successful");
            return <Navigate to={"/"} />;
          }
        }
      );
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="w-full h-screen bg-white container flex flex-col justify-center items-center">
        <h1 className="text-[80px] font-normal leading-[106.72px] font-JotiOne text-center">
          TalkNest
        </h1>
        <div className="w-1/3 shadow-md rounded-md py-10 px-10 box-border">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="block text-sm py-2">
                Enter Email
              </label>
              <input
                type="email"
                name="email"
                placeholder=""
                className="w-full px-2 py-2 border border-gray-300 rounded-md outline-none focus:border-gray-400"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500">{formik.errors.email}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="block text-sm py-2">
                Enter Password
              </label>
              <input
                type="password"
                name="password"
                placeholder=""
                className="w-full px-2 py-2 border border-gray-300 rounded-md outline-none focus:border-gray-400"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500">{formik.errors.password}</p>
              )}
            </div>
            <div className="mb-3">
              <button
                disabled={loading}
                className="bg-neutral-800 text-white px-3 py-2 rounded-md w-full hover:bg-neutral-700"
              >
                Sign In
              </button>
              <p className="text-sm text-black py-2">
                Don't have an account please{" "}
                <Link to="/register" className="text-blue-500">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
