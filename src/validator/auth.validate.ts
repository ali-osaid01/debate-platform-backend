import * as yup from "yup";

const registerRule = yup.object().shape({
  params: yup.object().noUnknown(),
  body: yup
    .object()
    .shape({
      name:yup.string().notRequired(),
      email: yup
        .string()
        .email()
        .required(),
        password: yup.string().required().min(6),
        fcmToken: yup.string().nullable(),
    }).noUnknown(),
  query: yup.object().noUnknown(),
});

const loginRule = yup.object().shape({
  params: yup.object().noUnknown(),
  body: yup
    .object()
    .shape({
      email: yup.string().email().required(),
      password: yup.string().min(3).required(),
      fcmToken: yup.string().nullable(),
    })
    .noUnknown(),
  query: yup.object().noUnknown(),
});

const resetPassword = yup.object().shape({
  params: yup.object().noUnknown(),
  body: yup
    .object()
    .shape({
      password: yup.string().min(6).required(),
    })
    .noUnknown(),
  query: yup.object().noUnknown(),
});

const updatePassword = yup.object().shape({
  params: yup.object().noUnknown(),
  body: yup
    .object()
    .shape({
      oldPassword: yup.string().min(6).required(),
      password: yup.string().min(6).required(),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required(),
    })
    .noUnknown(),
  query: yup.object().noUnknown(),
});

const forgetPassword = yup.object().shape({
  params: yup.object().noUnknown(),
  body: yup
    .object()
    .shape({
      email: yup
        .string()
        .email()
        .required()
    })
    .noUnknown(),
  query: yup.object().noUnknown(),
});

const resendOtp = yup.object().shape({
  params: yup.object().noUnknown(),
  body: yup
    .object()
    .shape({
      email: yup.string().email().required(),
    })
    .noUnknown(),
  query: yup.object().noUnknown(),
});

const verifyOtp = yup.object().shape({
  params: yup.object().noUnknown(),
  body: yup
    .object()
    .shape({
      email:yup.string().email(),
      otp: yup
        .number()
        .required()
        .test(
          "len",
          "OTP code must be exactly 6 digits",
          (val: number | undefined) => {
            if (!val) {
              return true;
            }
            return val.toString().length === 6;
          }
        ),
    })
    .noUnknown(),
  query: yup.object().noUnknown(),
});

const googleAuth = yup.object().shape({
  params: yup.object().noUnknown(),
  body: yup
    .object()
    .shape({
      email: yup.string().email().required(),
      socialAuthId: yup.string().required(),
      fcmToken: yup.string().required(),
    })
    .noUnknown(),
  query: yup.object().noUnknown(),
});


export = {
  "/register": registerRule,
  "/login": loginRule,
  "/forget-password": forgetPassword,
  "/reset-password": resetPassword,
  "/send-otp": resendOtp,
  "/verify-otp": verifyOtp,
  "/update-password": updatePassword,
  "/google-auth": googleAuth,
};