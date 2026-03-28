package com.example.demo.controller;

import com.example.demo.model.QuizQuestion;
import com.example.demo.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public ResponseEntity<List<QuizQuestion>> getQuestionsByCourseId(@RequestParam Long courseId) {
        List<QuizQuestion> questions = quizService.getQuestionsByCourseId(courseId);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(@RequestBody Map<String, Object> payload) {
        Long courseId = Long.valueOf(payload.get("courseId").toString());
        List<String> submittedAnswers = (List<String>) payload.get("answers"); // Expecting strings now

        List<QuizQuestion> questions = quizService.getQuestionsByCourseId(courseId);
        int score = quizService.calculateScore(questions, submittedAnswers);

        return ResponseEntity.ok(Map.of(
                "message", "Quiz submitted successfully",
                "score", score,
                "totalQuestions", questions.size()
        ));
    }

}
