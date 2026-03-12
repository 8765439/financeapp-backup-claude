package com.financeapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity @Table(name = "home_loan_rate_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HomeLoanRateHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "loan_id", nullable = false)
    private Long loanId;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "interest_rate", nullable = false)
    private BigDecimal interestRate;
}
