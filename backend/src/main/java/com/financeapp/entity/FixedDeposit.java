package com.financeapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "fixed_deposits")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FixedDeposit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Column(name = "account_number", nullable = false) private String accountNumber;
    @Column(name = "bank_name") private String bankName;
    @Column(name = "fd_type") private String fdType;
    @Column(name = "start_date", nullable = false) private LocalDate startDate;
    @Column(name = "maturity_date", nullable = false) private LocalDate maturityDate;
    @Column(name = "principal_amount", nullable = false) private BigDecimal principalAmount;
    @Column(name = "interest_rate") private BigDecimal interestRate;
    @Column(name = "monthly_interest") private BigDecimal monthlyInterest;
    @Column(name = "interest_month") private String interestMonth;
    @Column(name = "interest_year_type") private String interestYearType;
    @Column(name = "is_active") private Boolean isActive;
    private String notes;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @PrePersist void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate  void onUpdate() { updatedAt = LocalDateTime.now(); }
}
