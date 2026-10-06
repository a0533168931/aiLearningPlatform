import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../../components/auth/AuthCard';
import { useRegister } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../lib/apiError';
import { registerSchema, type RegisterFormValues } from '../../schemas/auth.schema';

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      void navigate('/dashboard', { replace: true });
    } catch {
      // Backend error is rendered from registerMutation.error
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Start learning with an AI tutor"
      footerText="Already have an account?"
      footerLinkTo="/login"
      footerLinkLabel="Sign in"
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="auth-field">
          <label htmlFor="name">Full Name</label>
          <TextField
            id="name"
            type="text"
            hiddenLabel
            fullWidth
            error={Boolean(errors.name)}
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          {errors.name && (
            <p id="name-error" className="field-error">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <TextField
            id="email"
            type="email"
            hiddenLabel
            fullWidth
            error={Boolean(errors.email)}
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="field-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <TextField
            id="password"
            type="password"
            hiddenLabel
            fullWidth
            error={Boolean(errors.password)}
            autoComplete="new-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="field-error">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <TextField
            id="confirmPassword"
            type="password"
            hiddenLabel
            fullWidth
            error={Boolean(errors.confirmPassword)}
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? true : undefined}
            aria-describedby={
              errors.confirmPassword ? 'confirm-password-error' : undefined
            }
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="field-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {registerMutation.error && (
          <Alert severity="error" className="form-message error">
            {getApiErrorMessage(registerMutation.error)}
          </Alert>
        )}

        <Button
          className="submit-btn"
          type="submit"
          variant="contained"
          fullWidth
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthCard>
  );
}
