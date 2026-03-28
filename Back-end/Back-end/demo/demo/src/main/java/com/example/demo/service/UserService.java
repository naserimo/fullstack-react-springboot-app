package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;



import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }




    public User signUp(String email, String password, String firstName, String lastName, Integer age) {
        // Check if the email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already registered.");
        }

        // Encrypt the password
        String hashedPassword = passwordEncoder.encode(password);

        // Validate age
        if (age < 14 || age > 100) {
            throw new RuntimeException("Age must be between 14 and 100.");
        }

        // Create the User object
        User user = new User();
        user.setEmail(email);
        user.setPassword(hashedPassword); // Save the hashed password
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAge(age);

        // Set the default role as "LEARNER"
        user.setRole("LEARNER");

        // Save the user in the database
        return userRepository.save(user);
    }




    public Optional<User> logIn(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            boolean isPasswordMatch = passwordEncoder.matches(password, user.getPassword());
            if (isPasswordMatch) {
                // Return the authenticated user with role information
                return Optional.of(user);
            }
        }
        // Return an empty Optional if login fails
        return Optional.empty();
    }









}