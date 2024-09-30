import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signUpSchema } from "./../validation/Index";

const Register = () => {
  const auth = getAuth();
  const db = getDatabase();

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => signUp(values),
  });

  const signUp = async ({ name, email, password }) => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password).then(
        async ({ user }) => {
          const { uid } = user;
          await updateProfile(auth.currentUser, { displayName: name }).then(
            async () => {
              await set(ref(db, "users/" + uid), {
                name,
                email,
                uid,
              }).then(async () => {
                await sendEmailVerification(auth.currentUser).then(() => {
                  toast.success("Please verify your email");
                });
              });

              formik.resetForm();
            }
          );
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
        <title>Register</title>
      </Helmet>
      <div className="w-full h-screen bg-white container flex flex-col justify-center items-center">
        <h1 className="text-[80px] font-normal leading-[106.72px] font-JotiOne text-center">
          TalkNest
        </h1>
        <div className="w-1/3 shadow-md rounded-md py-10 px-10 box-border">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="block text-sm py-2">
                Enter Name
              </label>
              <input
                type="text"
                name="name"
                placeholder=""
                className="w-full px-2 py-2 border border-gray-300 rounded-md outline-none focus:border-gray-400"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500">{formik.errors.name}</p>
              )}
            </div>
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
              <label htmlFor="password" className="block text-sm py-2">
                Enter Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder=""
                className="w-full px-2 py-2 border border-gray-300 rounded-md outline-none focus:border-gray-400"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>
            <div className="mb-3">
              <button
                disabled={loading}
                className="bg-neutral-800 text-white px-3 py-2 rounded-md w-full hover:bg-neutral-700"
              >
                Sign Up
              </button>
              <p className="text-sm text-black py-2">
                Already have an account please{" "}
                <Link to="/login" className="text-blue-500">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
