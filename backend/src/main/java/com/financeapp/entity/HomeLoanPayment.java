package com.financeapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity @Table(name = "home_loan_payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HomeLoanPayment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "loan_id", nullable = false)
    private Long loanId;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "credited_amount")
    private BigDecimal creditedAmount;

    @Column(name = "interest_charged")
    private BigDecimal interestCharged;

    @Column(name = "principal_paid")
    private BigDecimal principalPaid;

    @Column(name = "emi_amount")
    private BigDecimal emiAmount;

    @Column(name = "remaining_balance")
    private BigDecimal remainingBalance;

    @Column(name = "amount_cleared")
    private BigDecimal amountCleared;
}
