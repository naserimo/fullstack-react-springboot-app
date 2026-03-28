import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/Quiz.module.css";

interface Question {
    id: number;
    questionText: string;
    options: string[];
}

interface QuizResult {
    message: string;
    score: number;
    totalQuestions: number;
}

const Quiz: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/quizzes?courseId=${courseId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch quiz questions.");
                const data = await res.json();

                // Transform options into an array
                const transformedData = data.map((question: any) => ({
                    ...question,
                    options: [question.option1, question.option2, question.option3, question.option4],
                }));

                setQuestions(transformedData);
            } catch (err) {
                const errorMessage = (err as Error).message || "Error fetching quiz questions.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [courseId]);


    const handleOptionChange = (questionId: number, selectedOption: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
    };

    const handleSubmitQuiz = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/quizzes/submit`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseId: Number(courseId),
                    answers: Object.values(answers), // Send selected answers
                }),
            });

            if (!res.ok) throw new Error("Failed to submit quiz.");
            const result = await res.json();
            setQuizResult(result); // Display the result
        } catch (err) {
            setError((err as Error).message || "Failed to submit quiz.");
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.quizContainer}>
            <h1>Quiz for Course {courseId}</h1>
            {quizResult ? (
                <div className={styles.resultContainer}>
                    <h2>{quizResult.message}</h2>
                    <p>
                        Score: {quizResult.score}/{quizResult.totalQuestions}
                    </p>
                </div>
            ) : (
                <form onSubmit={(e) => e.preventDefault()} className={styles.quizForm}>
                    {questions.map((question) => (
                        <div key={question.id} className={styles.questionContainer}>
                            <p className={styles.questionText}>{question.questionText}</p>
                            <div className={styles.customSelect}>
                                <select
                                    name={`question-${question.id}`}
                                    onChange={(e) => handleOptionChange(question.id, e.target.value)}
                                    value={answers[question.id] || ""}
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    {question.options.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}


                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleSubmitQuiz}
                    >
                        Submit Quiz
                    </button>
                </form>
            )}
        </div>
    );
};

export default Quiz;
