package com.agrifreeze.service;

import com.agrifreeze.dto.LoginRequest;
import com.agrifreeze.dto.LoginResponse;
import com.agrifreeze.dto.RegisterRequest;
import com.agrifreeze.entity.AppUser;
import com.agrifreeze.exception.BadRequestException;
import com.agrifreeze.exception.DuplicateResourceException;
import com.agrifreeze.exception.UnauthorizedException;
import com.agrifreeze.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

@Service
public class AuthService {

	private static final Set<String> VALID_ROLES = Set.of("ADMIN", "MANAGER", "FARMER");

	private final AppUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final EmailService emailService;

	public AuthService(AppUserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.emailService = emailService;
	}

	@Transactional
	public LoginResponse register(RegisterRequest request) {
		if (request == null) {
			throw new BadRequestException("Registration request payload cannot be empty");
		}

		if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
			throw new BadRequestException("Full name is required");
		}

		if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
			throw new BadRequestException("Email is required");
		}

		if (request.getPassword() == null || request.getPassword().isEmpty()) {
			throw new BadRequestException("Password is required");
		}

		String normalizedEmail = request.getEmail().trim().toLowerCase();

		if (userRepository.existsByEmail(normalizedEmail)) {
			throw new DuplicateResourceException("Email is already registered");
		}

		String assignedRole = "FARMER";
		if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
			String roleUpper = request.getRole().trim().toUpperCase();
			if (!VALID_ROLES.contains(roleUpper)) {
				throw new BadRequestException(
						"Invalid role: '" + request.getRole() + "'. Allowed roles are ADMIN, MANAGER, or FARMER");
			}
			assignedRole = roleUpper;
		}

		AppUser user = new AppUser();
		user.setFullName(request.getFullName().trim());
		user.setEmail(normalizedEmail);
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
		user.setRole(assignedRole);
		user.setStatus("ACTIVE");
		user.setExperience(request.getExperience() != null ? request.getExperience().trim() : null);
		user.setCreatedAt(LocalDateTime.now());

		AppUser savedUser = userRepository.save(user);

		if ("MANAGER".equalsIgnoreCase(assignedRole)) {
			emailService.sendManagerAssignmentEmail(
					savedUser.getEmail(),
					savedUser.getFullName(),
					"Assigned Cold Storage Facility",
					request.getPassword()
			);
		}

		return new LoginResponse(savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(), savedUser.getPhone(),
				savedUser.getRole(), savedUser.getStatus(), savedUser.getProfilePicture(),
				"User registered successfully");
	}

	@Transactional(readOnly = true)
	public LoginResponse login(LoginRequest request) {
		if (request == null) {
			throw new BadRequestException("Login request payload cannot be empty");
		}

		if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
			throw new BadRequestException("Email is required");
		}

		if (request.getPassword() == null || request.getPassword().isEmpty()) {
			throw new BadRequestException("Password is required");
		}

		String normalizedEmail = request.getEmail().trim().toLowerCase();

		AppUser user = userRepository.findByEmail(normalizedEmail)
				.orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

		boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());

		if (!passwordMatches) {
			throw new UnauthorizedException("Invalid email or password");
		}

		if (user.getStatus() != null && !user.getStatus().equalsIgnoreCase("ACTIVE")) {
			throw new UnauthorizedException("Account is " + user.getStatus().toLowerCase() + ". Access denied.");
		}

		return new LoginResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getRole(),
				user.getStatus(), user.getProfilePicture(), "Login successful");
	}
}
