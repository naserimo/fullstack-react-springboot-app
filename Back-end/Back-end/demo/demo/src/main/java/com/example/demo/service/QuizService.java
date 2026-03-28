package com.example.demo.service;

import com.example.demo.model.QuizQuestion;
import com.example.demo.repository.QuizQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {
    private final QuizQuestionRepository quizQuestionRepository;

    public QuizService(QuizQuestionRepository quizQuestionRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
    }

    public List<QuizQuestion> getQuestionsByCourseId(Long courseId) {
        return quizQuestionRepository.findByCourseId(courseId);
    }

    public int calculateScore(List<QuizQuestion> questions, List<String> submittedAnswers) {
        int score = 0;
        for (int i = 0; i < questions.size(); i++) {
            QuizQuestion question = questions.get(i);
            String correctAnswer = switch (question.getCorrectOption()) {
                case 1 -> question.getOption1();
                case 2 -> question.getOption2();
                case 3 -> question.getOption3();
                case 4 -> question.getOption4();
                default -> null;
            };

            if (correctAnswer != null && correctAnswer.equals(submittedAnswers.get(i))) {
                score++;
            }
        }
        return score;
    }

}
