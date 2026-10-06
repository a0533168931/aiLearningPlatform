import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import { isPositiveId } from '../../api/queryKeys';
import { useCreatePrompt } from '../../hooks/usePrompts';
import { useSubcategories } from '../../hooks/useSubcategories';
import type { CreatePromptFormValues } from '../../schemas/prompt.schema';
import '../../styles/ai-tutor.css';
import type { SubCategory } from '../../types/category';
import AiResponse from './AiResponse';
import AiTutorForm from './AiTutorForm';

export type AiTutorProps = {
  categoryId: number;
  categoryName?: string;
  initialSubcategoryId?: number | null;
};

type TutorResult = {
  question: string;
  answer: string;
  categoryName: string;
  subcategoryName: string;
};

export default function AiTutor({
  categoryId,
  categoryName,
  initialSubcategoryId = null,
}: AiTutorProps) {
  const validCategoryId = isPositiveId(categoryId) ? categoryId : null;
  const subcategoriesQuery = useSubcategories(validCategoryId);
  const createPrompt = useCreatePrompt();
  const [result, setResult] = useState<TutorResult | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (result) {
      resultRef.current?.focus();
    }
  }, [result]);

  const handleCreate = async (
    values: CreatePromptFormValues,
    subcategory: SubCategory
  ) => {
    const created = await createPrompt.mutateAsync({
      categoryId: values.categoryId,
      subCategoryId: values.subCategoryId,
      prompt: values.prompt,
    });

    setResult({
      question: created.prompt,
      answer: created.response,
      categoryName: categoryName ?? `Category #${created.categoryId}`,
      subcategoryName: subcategory.name,
    });
  };

  const handleAskAnother = () => {
    promptRef.current?.focus();
  };

  return (
    <div className="ai-tutor">
      <AiTutorForm
        categoryId={categoryId}
        categoryName={categoryName}
        initialSubcategoryId={initialSubcategoryId}
        subcategories={subcategoriesQuery.data ?? []}
        subcategoriesLoading={subcategoriesQuery.isPending}
        subcategoriesError={subcategoriesQuery.error}
        isSubmitting={createPrompt.isPending}
        submitError={createPrompt.error}
        promptRef={promptRef}
        onCreate={handleCreate}
      />

      {result && (
        <>
          <AiResponse
            ref={resultRef}
            question={result.question}
            answer={result.answer}
            categoryName={result.categoryName}
            subcategoryName={result.subcategoryName}
          />
          <div className="ai-tutor-actions">
            <Button
              type="button"
              className="ai-tutor-again"
              variant="text"
              onClick={handleAskAnother}
            >
              Ask another question
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
