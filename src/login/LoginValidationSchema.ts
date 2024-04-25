import * as Yup from 'yup';

export const LoginValidationSchema = Yup.object({
  username: Yup.string()
    .max(50, 'caracters_limit')
    .required('required_username'),
  password: Yup.string()
    .max(50, 'caracters_limit')
    .required('required_password'),
});

export const ResetPasswordSchema = Yup.object({
  email: Yup.string()
      .max(50, 'caracters_limit')
      .required('required_email')
});
