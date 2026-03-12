package com.financeapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "home_loan")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HomeLoan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String lender;

    @Column(name = "loan_account")
    private String loanAccount;

    @Column(name = "sanctioned_amount")
    private BigDecimal sanctionedAmount;

    @Column(name = "disbursed_amount")
    private BigDecimal disbursedAmount;

    @Column(name = "property_name")
    private String propertyName;

    @Column(name = "total_property_cost")
    private BigDecimal totalPropertyCost;

    @Column(name = "tenure_years")
    private Integer tenureYears;

    @Column(name = "sanction_date")
    private LocalDate sanctionDate;

    @Column(name = "is_self_occupied")
    private Boolean isSelfOccupied;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist void onCreate() { createdAt = LocalDateTime.now(); }
}
