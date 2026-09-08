import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isPositiveId } from '../../api/queryKeys';
import { getApiErrorMessage } from '../../lib/apiError';
import {
  createPromptSchema,
  type CreatePromptFormValues,
} from '../../schemas/prompt.schema';
import type { SubCategory } from '../../types/category';

export type AiTutorFormProps = {
  categoryId: number;
  categoryName?: string;
  initialSubcategoryId?: number | null;
  subcategories: SubCategory[];
  subcategoriesLoading: boolean;
  subcategoriesError: unknown | null;
  isSubmitting: boolean;
  submitError: unknown | null;
  promptRef: RefObject<HTMLTextAreaElement | null>;
  onCreate: (
    values: CreatePromptFormValues,
    subcategory: SubCategory
  ) => Promise<void>;
};

function resolveSubcategoryId(
  current: number,
  categoryId: number,
  subcategories: SubCategory[],
  initialSubcategoryId: number | null | undefined
): number {
  const inCategory = subcategories.filter(
    (item) => item.categoryId === categoryId
  );

  if (inCategory.some((item) => item.id === current)) {
    return current;
  }

  if (
    isPositiveId(initialSubcategoryId) &&
    inCategory.some((item) => item.id === initialSubcategoryId)
  ) {
    return initialSubcategoryId;
  }

  return 0;
}

export default function AiTutorForm({
  categoryId,
  categoryName,
  initialSubcategoryId,
  subcategories,
  subcategoriesLoading,
  subcategoriesError,
  isSubmitting,
  submitError,
  promptRef,
  onCreate,
}: AiTutorFormProps) {
  const categoryIsValid = isPositiveId(categoryId);
  const categoryLabel = categoryName ?? `Category #${categoryId}`;
  const hasSubcategories = subcategories.length > 0;
  const selectDisabled =
    isSubmitting || !categoryIsValid || subcategoriesLoading || !hasSubcategories;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreatePromptFormValues>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      categoryId: categoryIsValid ? categoryId : 0,
      subCategoryId:
        isPositiveId(initialSubcategoryId) ? initialSubcategoryId : 0,
      prompt: '',
    },
  });

  const promptRegister = register('prompt');

  useEffect(() => {
    setValue('categoryId', categoryIsValid ? categoryId : 0);
  }, [categoryId, categoryIsValid, setValue]);

  useEffect(() => {
    if (subcategoriesLoading) {
      return;
    }

    const nextId = resolveSubcategoryId(
      getValues('subCategoryId'),
      categoryId,
      subcategories,
      initialSubcategoryId
    );

    setValue('subCategoryId', nextId, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [
    categoryId,
    subcategories,
    initialSubcategoryId,
    subcategoriesLoading,
    getValues,
    setValue,
  ]);

  const onSubmit = async (values: CreatePromptFormValues) => {
    if (isSubmitting) {
      return;
    }

    const selected = subcategories.find(
      (item) =>
        item.id === values.subCategoryId && item.categoryId === categoryId
    );

    if (!selected) {
      setError('subCategoryId', {
        type: 'manual',
        message: 'Please select a subcategory',
      });
      return;
    }

    try {
      await onCreate(values, selected);
      setValue('prompt', '');
      clearErrors('prompt');
    } catch {
      // API error is rendered from submitError
    }
  };

  const subcategoryStatusId = subcategoriesLoading
    ? 'ai-tutor-subcategory-status'
    : subcategoriesError
      ? 'ai-tutor-subcategory-api-error'
      : !subcategoriesLoading && !hasSubcategories && categoryIsValid
        ? 'ai-tutor-subcategory-empty'
        : undefined;

  const subcategoryDescribedBy = [
    errors.subCategoryId ? 'ai-tutor-subcategory-error' : undefined,
    subcategoryStatusId,
  ]
    .filter((id): id is string => id != null)
    .join(' ');

  return (
    <form
      className="ai-tutor-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isSubmitting ? true : undefined}
    >
      <input type="hidden" {...register('categoryId', { valueAsNumber: true })} />

      <div className="ai-tutor-field">
        <span className="ai-tutor-label" id="ai-tutor-category-label">
          Category
        </span>
        <p className="ai-tutor-category" aria-labelledby="ai-tutor-category-label">
          {categoryLabel}
        </p>
        {!categoryIsValid && (
          <p className="ai-tutor-field-error" role="alert">
            A valid category is required.
          </p>
        )}
      </div>

      <div className="ai-tutor-field">
        <label className="ai-tutor-label" htmlFor="ai-tutor-subcategory">
          Subcategory
        </label>
        <Controller
          name="subCategoryId"
          control={control}
          render={({ field }) => (
            <TextField
              id="ai-tutor-subcategory"
              className="ai-tutor-select"
              select
              hiddenLabel
              fullWidth
              name={field.name}
              inputRef={field.ref}
              disabled={selectDisabled}
              error={Boolean(errors.subCategoryId)}
              aria-invalid={errors.subCategoryId ? true : undefined}
              aria-describedby={
                subcategoryDescribedBy !== '' ? subcategoryDescribedBy : undefined
              }
              value={isPositiveId(field.value) ? String(field.value) : ''}
              onBlur={field.onBlur}
              onChange={(event) => {
                const next = event.target.value;
                field.onChange(next === '' ? 0 : Number(next));
              }}
            >
              <MenuItem value="">
                {subcategoriesLoading
                  ? 'Loading subcategories...'
                  : 'Select a subcategory'}
              </MenuItem>
              {subcategories.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        {subcategoriesLoading && (
          <p
            id="ai-tutor-subcategory-status"
            className="ai-tutor-status mui-status"
            role="status"
            aria-busy="true"
          >
            <CircularProgress size={16} />
            Loading subcategories...
          </p>
        )}
        {subcategoriesError != null && (
          <Alert
            id="ai-tutor-subcategory-api-error"
            severity="error"
            className="ai-tutor-alert"
          >
            {getApiErrorMessage(subcategoriesError)}
          </Alert>
        )}
        {!subcategoriesLoading &&
          subcategoriesError == null &&
          categoryIsValid &&
          !hasSubcategories && (
            <p id="ai-tutor-subcategory-empty" className="ai-tutor-status" role="status">
              There are no subcategories in this category yet.
            </p>
          )}
        {errors.subCategoryId && (
          <p id="ai-tutor-subcategory-error" className="ai-tutor-field-error">
            {errors.subCategoryId.message}
          </p>
        )}
      </div>

      <div className="ai-tutor-field">
        <label className="ai-tutor-label" htmlFor="ai-tutor-prompt">
          Your question
        </label>
        <TextField
          id="ai-tutor-prompt"
          className="ai-tutor-textarea"
          hiddenLabel
          fullWidth
          multiline
          rows={6}
          placeholder="Ask a question about this topic..."
          disabled={isSubmitting}
          error={Boolean(errors.prompt)}
          aria-invalid={errors.prompt ? true : undefined}
          aria-describedby={errors.prompt ? 'ai-tutor-prompt-error' : undefined}
          name={promptRegister.name}
          onChange={promptRegister.onChange}
          onBlur={promptRegister.onBlur}
          inputRef={(element: HTMLTextAreaElement | null) => {
            promptRegister.ref(element);
            promptRef.current = element;
          }}
        />
        {errors.prompt && (
          <p id="ai-tutor-prompt-error" className="ai-tutor-field-error">
            {errors.prompt.message}
          </p>
        )}
      </div>

      {isSubmitting && (
        <p className="ai-tutor-status mui-status" role="status" aria-live="polite">
          <CircularProgress size={16} />
          Sending your question...
        </p>
      )}

      {submitError != null && !isSubmitting && (
        <Alert severity="error" className="ai-tutor-alert">
          {getApiErrorMessage(submitError)}
        </Alert>
      )}

      <div className="ai-tutor-actions">
        <Button
          className="ai-tutor-submit"
          type="submit"
          variant="contained"
          disabled={selectDisabled}
        >
          {isSubmitting ? 'Sending...' : 'Ask AI'}
        </Button>
        <span className="ai-tutor-hint">
          Your question is sent to the tutor for this category and subcategory.
        </span>
      </div>
    </form>
  );
}
