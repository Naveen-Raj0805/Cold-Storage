package com.agrifreeze.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:notifications@agrifreeze.com}")
    private String fromEmail;

    @Async
    public void sendManagerAssignmentEmail(String managerEmail, String managerName, String storageName, String rawPassword) {
        String subject = "[AgriFreeze] Welcome! Manager Assignment & Login Credentials";
        String body = String.format("""
                Hello %s,

                Welcome to the AgriFreeze Cold Chain Platform!

                You have been assigned as the Official Facility Manager for:
                -> Storage Facility: %s

                Your Account Credentials:
                -> Login Email: %s
                -> Initial Password: %s

                Please log in to your Manager Dashboard to manage storage chambers, farmer allocation requests, and inventory telemetries.

                Best regards,
                AgriFreeze Platform Administration
                """,
                managerName != null ? managerName : "Manager",
                storageName != null ? storageName : "Assigned Cold Storage",
                managerEmail,
                rawPassword != null ? rawPassword : "password"
        );

        sendEmailSafely(managerEmail, subject, body);
    }

    @Async
    public void sendFarmerSignupRequestEmail(String farmerEmail, String farmerName, String storageName, String managerEmail) {
        // 1. Send confirmation email to Farmer
        String farmerSubject = "[AgriFreeze] Storage Allocation Request Submitted";
        String farmerBody = String.format("""
                Hello %s,

                Your storage allocation request for facility '%s' has been successfully submitted to the Respected Storage Manager.

                Status: PENDING MANAGER APPROVAL

                You will receive a confirmation email as soon as the manager reviews and grants access to your allocated chamber.

                Best regards,
                AgriFreeze Operations Team
                """,
                farmerName != null ? farmerName : "Farmer",
                storageName != null ? storageName : "Selected Cold Storage"
        );

        sendEmailSafely(farmerEmail, farmerSubject, farmerBody);

        // 2. Send notification email to Target Manager
        if (managerEmail != null && !managerEmail.trim().isEmpty() && !managerEmail.equalsIgnoreCase("Unassigned")) {
            String managerSubject = "[AgriFreeze] New Farmer Storage Request Received";
            String managerBody = String.format("""
                    Respected Manager,

                    Farmer %s has submitted a new storage allocation request for facility '%s'.

                    Please log in to your AgriFreeze Manager Dashboard to review and accept/approve this request.

                    Best regards,
                    AgriFreeze Automated Notification System
                    """,
                    farmerName != null ? farmerName : "A Farmer",
                    storageName != null ? storageName : "Your Storage Facility"
            );

            sendEmailSafely(managerEmail, managerSubject, managerBody);
        }
    }

    @Async
    public void sendFarmerApprovalEmail(String farmerEmail, String farmerName, String managerName, String storageName) {
        String subject = "[AgriFreeze] Request Approved! Permission Granted to Access Storage";
        String body = String.format("""
                Hello %s,

                Great news! Manager %s has ACCEPTED your request and granted permission for facility '%s'!

                Status: APPROVED & ACTIVE

                You can now log in to the AgriFreeze platform, view your assigned chamber allocation, and check in your crop cargo.

                Best regards,
                AgriFreeze Cold Storage Team
                """,
                farmerName != null ? farmerName : "Farmer",
                managerName != null ? managerName : "Storage Manager",
                storageName != null ? storageName : "AgriFreeze Hub"
        );

        sendEmailSafely(farmerEmail, subject, body);
    }

    private void sendEmailSafely(String to, String subject, String body) {
        logger.info("\n========== [EMAIL NOTIFICATION TRIGGERED] ==========\nTO: {}\nSUBJECT: {}\nBODY:\n{}\n====================================================", to, subject, body);
        if (mailSender == null) {
            logger.warn("JavaMailSender bean is not configured or disabled; email logged above.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmail != null && !fromEmail.trim().isEmpty() && fromEmail.contains("@")) {
                message.setFrom(fromEmail.trim());
            }
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            logger.info("Email successfully dispatched via SMTP to {}", to);
        } catch (Exception e) {
            logger.warn("SMTP Email delivery to {} failed or offline (Logged safely without breaking application): {}", to, e.getMessage(), e);
        }
    }
}
