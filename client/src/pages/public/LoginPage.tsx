import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../../components/auth/AuthCard';
import { useLogin } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../lib/apiError';
import { loginSchema, type LoginFormValues } from '../../schemas/auth.schema';

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(values);
      void navigate('/dashboard', { replace: true });
    } catch {
      // Backend error is rendered from loginMutation.error
    }
  };

  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back to AI Learning Platform"
      footerText="Need an account?"
      footerLinkTo="/register"
      footerLinkLabel="Register"
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
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
          <input
            id="password"
            type="password"
            autoComplete="current-password"
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

        {loginMutation.error && (
          <p className="form-message error" role="alert">
            {getApiErrorMessage(loginMutation.error)}
          </p>
        )}

        <button className="submit-btn" type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthCard>
  );
}
