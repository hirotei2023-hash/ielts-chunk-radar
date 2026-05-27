// components/review/review-card.tsx
"use client";

import { useState } from "react";
import type { ReviewQuestion } from "@/lib/review-algorithm";

interface ReviewCardProps {
  question: ReviewQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (chunkId: string, correct: boolean) => void;
  onNext: () => void;
}

export function ReviewCard({ question, questionIndex, totalQuestions, onAnswer, onNext }: ReviewCardProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = (answer: string) => {
    const correct = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswer(question.chunkId, correct);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !selectedOption) return;
    checkAnswer(selectedOption || inputValue);
  };

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: "#292524" }}>
      {/* Progress */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs" style={{ color: "#a8a29e" }}>
          {questionIndex + 1} / {totalQuestions}
        </span>
        <span className="rounded px-2 py-0.5 text-[10px]" style={{ backgroundColor: "#1c1917", color: "#a8a29e" }}>
          {question.type === "chinese-to-english" ? "中→英" : question.type === "collocation-gap" ? "搭配填空" : "英→中"}
        </span>
      </div>

      {/* Prompt */}
      <p className="mb-4 whitespace-pre-line text-sm leading-relaxed" style={{ color: "#fafaf9" }}>
        {question.prompt}
      </p>

      {/* Hint */}
      {question.hint && (
        <p className="mb-3 rounded p-2 text-xs" style={{ backgroundColor: "#1c1917", color: "#a8a29e" }}>
          {question.hint}
        </p>
      )}

      {/* Input for non-choice questions */}
      {!question.options && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={submitted}
            placeholder="输入你的答案..."
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: "#1c1917", color: "#fafaf9", border: "1px solid #44403c" }}
          />
          {!submitted && (
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-full rounded-full py-2 text-sm font-medium"
              style={{ backgroundColor: "#f59e0b", color: "#1c1917" }}
            >
              确认
            </button>
          )}
        </form>
      )}

      {/* Choice for topic-match */}
      {question.options && (
        <div className="space-y-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                if (!submitted) {
                  setSelectedOption(opt);
                  checkAnswer(opt);
                }
              }}
              disabled={submitted}
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
              style={{
                backgroundColor: submitted
                  ? opt === question.correctAnswer
                    ? "rgba(132,204,22,0.15)"
                    : opt === selectedOption
                    ? "rgba(239,68,68,0.15)"
                    : "#1c1917"
                  : selectedOption === opt
                  ? "#44403c"
                  : "#1c1917",
                color: submitted
                  ? opt === question.correctAnswer
                    ? "#bef264"
                    : "#d6d3d1"
                  : "#d6d3d1",
                border: `1px solid ${selectedOption === opt && !submitted ? "#f59e0b" : "#44403c"}`,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Skip button */}
      {!submitted && (
        <button
          onClick={() => checkAnswer("")}
          className="mt-3 w-full rounded-full py-1.5 text-xs transition-colors hover:brightness-110"
          style={{ backgroundColor: "#1c1917", color: "#78716c" }}
        >
          跳过
        </button>
      )}

      {/* Result feedback + Next button */}
      {submitted && (
        <>
          <div
            className="mt-3 rounded-lg p-3 text-sm"
            style={{
              backgroundColor: isCorrect ? "rgba(132,204,22,0.1)" : "rgba(239,68,68,0.1)",
              color: isCorrect ? "#bef264" : "#fca5a5",
            }}
          >
            {isCorrect ? "正确！" : `正确答案：${question.correctAnswer}`}
          </div>
          <button
            onClick={onNext}
            className="mt-3 w-full rounded-full py-2 text-sm font-medium transition-colors hover:brightness-110"
            style={{ backgroundColor: "#f59e0b", color: "#1c1917" }}
          >
            {questionIndex + 1 >= totalQuestions ? "查看结果" : "下一题"}
          </button>
        </>
      )}
    </div>
  );
}
