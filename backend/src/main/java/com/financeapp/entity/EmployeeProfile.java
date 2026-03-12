package com.financeapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// ── EmployeeProfile ──────────────────────────────────────────────────────
@Entity @Table(name = "employee_profile")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
class EmployeeProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    private String employeeId;
    private String fullName;
    private String department;
    private String employer;
    private LocalDate dateOfJoining;
    private LocalDate dateOfBirth;
    private Integer managementLevel;
    private String pan;
    private Boolean isMetro;
    private BigDecimal pfPercentage;
    private BigDecimal npsPercentage;
    private String financialYear;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @PrePersist void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate  void onUpdate() { updatedAt = LocalDateTime.now(); }
}
