import { forwardRef } from 'react';

export type AiResponseProps = {
  question: string;
  answer: string;
  categoryName?: string;
  subcategoryName?: string;
};

const AiResponse = forwardRef<HTMLElement, AiResponseProps>(
  function AiResponse(
    { question, answer, categoryName, subcategoryName },
    ref
  ) {
    const hasContext =
      (categoryName != null && categoryName !== '') ||
      (subcategoryName != null && subcategoryName !== '');

    return (
      <section
        ref={ref}
        className="ai-tutor-response"
        tabIndex={-1}
        aria-labelledby="ai-tutor-response-heading"
      >
        <h3 id="ai-tutor-response-heading">AI response</h3>

        {hasContext && (
          <p className="ai-tutor-response-context">
            {categoryName}
            {categoryName && subcategoryName ? ' · ' : ''}
            {subcategoryName}
          </p>
        )}

        <div className="ai-tutor-response-block">
          <h4>Your question</h4>
          <p className="ai-tutor-question">{question}</p>
        </div>

        <div className="ai-tutor-response-block">
          <h4>Answer</h4>
          <p className="ai-tutor-answer">{answer}</p>
        </div>
      </section>
    );
  }
);

export default AiResponse;
