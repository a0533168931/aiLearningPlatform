import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from '../../lib/apiError';
import {
  categoryNameSchema,
  type CategoryNameFormValues,
} from '../../schemas/category.schema';

type NameFormProps = {
  idPrefix?: string;
  defaultName?: string;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  error: unknown | null;
  onSubmitName: (name: string) => Promise<void>;
};

export default function NameForm({
  idPrefix = 'entity',
  defaultName = '',
  submitLabel,
  pendingLabel,
  isPending,
  error,
  onSubmitName,
}: NameFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryNameFormValues>({
    resolver: zodResolver(categoryNameSchema),
    defaultValues: { name: defaultName },
  });

  useEffect(() => {
    reset({ name: defaultName });
  }, [defaultName, reset]);

  const onSubmit = async (values: CategoryNameFormValues) => {
    try {
      await onSubmitName(values.name);
    } catch {
      // API error is rendered from the error prop
    }
  };

  const nameId = `${idPrefix}-name`;
  const nameErrorId = `${idPrefix}-name-error`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="app-field">
        <label htmlFor={nameId}>Name</label>
        <TextField
          id={nameId}
          type="text"
          hiddenLabel
          fullWidth
          autoComplete="off"
          disabled={isPending}
          error={Boolean(errors.name)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? nameErrorId : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id={nameErrorId} className="app-field-error">
            {errors.name.message}
          </p>
        )}
      </div>
      {error != null && !isPending && (
        <Alert severity="error" className="app-alert">
          {getApiErrorMessage(error)}
        </Alert>
      )}
      <Button className="app-btn" type="submit" variant="contained" disabled={isPending}>
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
