import { TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import PrimaryButton from "../components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import MuiModal from "../components/Modal";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { isValidInternationalPhone } from "../utils/validators";

export default function Signup() {
  const [openModal, setOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
      customerType: "",
      yearOfStudy: "",
      purpose: "",
    },
  });

  // inside your component
  useEffect(() => {
    if (auth?.user) navigate("/profile", { replace: true });
  }, [auth, navigate]);

  const { mutate: submitRegistration, isPending } = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        sheetName: "Sign_up",
      };

      const response = await axios.post(
        "/forms/add-new-b2c-form-submission",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        "Signup successful! Please check your email for confirmation.",
      );

      reset();
      setOpenModal(true);
    },
    onError: (error) => {
      // toast.error(error.response?.data?.message || "Something went wrong");
      toast.error(error.response?.data?.message);
    },
  });

  const onSubmit = (data) => submitRegistration(data);

  const customerType = watch("customerType");
  const yearOfStudy = watch("yearOfStudy");

  const yearOfStudyOptions =
    customerType === "School Student"
      ? [
          { value: "10th Standard", label: "10th Standard" },
          { value: "11th Standard", label: "11th Standard" },
        ]
      : customerType === "University Student"
        ? [
            { value: "Foundation Year", label: "Foundation Year" },
            { value: "1st Year", label: "1st Year" },
            { value: "2nd Year", label: "2nd Year" },
            { value: "3rd Year", label: "3rd Year" },
            { value: "4th Year", label: "4th Year" },
          ]
        : [];

  const showYearOfStudy =
    customerType === "School Student" || customerType === "University Student";

  useEffect(() => {
    if (!showYearOfStudy) {
      setValue("yearOfStudy", "");
      return;
    }

    if (
      yearOfStudy &&
      !yearOfStudyOptions.some((option) => option.value === yearOfStudy)
    ) {
      setValue("yearOfStudy", "");
    }
  }, [showYearOfStudy, yearOfStudy, yearOfStudyOptions, setValue]);

  return (
    <div className="flex items-center justify-center px-4 md:h-[60vh] lg:h-[80vh] border-gray-300 rounded-lg">
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h1 className="text-hero">Signup</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* First Name */}
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "First name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                required
                variant="standard"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Last Name */}
          <Controller
            name="lastName"
            control={control}
            rules={{ required: "Last name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                required
                variant="standard"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                required
                variant="standard"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Mobile */}
          <Controller
            name="mobile"
            control={control}
            rules={{
              required: "Mobile number is required",
              validate: isValidInternationalPhone,
            }}
            render={({ field, fieldState }) => (
              <MuiTelInput
                {...field}
                label="Mobile"
                fullWidth
                required
                defaultCountry="IN"
                variant="standard"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                variant="standard"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: "Please confirm password" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                required
                variant="standard"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Purpose */}
          <Controller
            name="purpose"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Purpose"
                select
                fullWidth
                variant="standard"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                <MenuItem value="Browsing">Browsing</MenuItem>
                <MenuItem value="Applying to University">
                  Applying to University
                </MenuItem>
                <MenuItem value="Searching for tuitions">
                  Searching for tuitions
                </MenuItem>
                <MenuItem value="to become a contributor">
                  to become a contributor
                </MenuItem>
              </TextField>
            )}
          />

          {/* Customer Type */}
          <Controller
            name="customerType"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Customer Type"
                select
                fullWidth
                variant="standard"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                <MenuItem value="School Student">School Student</MenuItem>
                <MenuItem value="University Student">
                  University Student
                </MenuItem>
                <MenuItem value="Parent">Parent</MenuItem>
                <MenuItem value="School Representative">
                  School Representative
                </MenuItem>
                <MenuItem value="University Representative">
                  University Representative
                </MenuItem>
              </TextField>
            )}
          />

          {/* Year Of Study */}
          {showYearOfStudy ? (
            <div className="col-span-1 md:col-span-2">
              <Controller
                name="yearOfStudy"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Year Of Study"
                    select
                    fullWidth
                    variant="standard"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    {yearOfStudyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
          ) : null}

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center items-center mt-2 py-2 w-full">
            <PrimaryButton
              type="submit"
              isLoading={isPending}
              title="Signup"
              disabled={isPending}
              className="bg-[#FF5757] flex text-white font-[500] capitalize hover:bg-[#E14C4C] w-full sm:w-[7rem] px-6"
            />
          </div>

          {/* Login Link */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-center">
              Already have an account?&nbsp;
              <span className="underline">
                <Link to="/login">Log In</Link>
              </span>
            </p>
          </div>
        </form>

        <MuiModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Registration Successful"
          height="20vh"
          width="30vw"
          color="text-green-500"
        >
          <div className="flex flex-col space-y-4 text-pretty">
            <p>Thank you for signing up with WoNo.</p>
            <p>
              Kindly allow us some time to evaluate your profile. Once done,
              your Personal Assistant from WoNo will connect with you to onboard
              you for your Signup process.
            </p>
            <p>Thank you again for trusting us and signing up!</p>
          </div>
        </MuiModal>
      </div>
    </div>
  );
}
