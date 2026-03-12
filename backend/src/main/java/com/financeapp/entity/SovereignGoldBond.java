package com.financeapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "sovereign_gold_bonds")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SovereignGoldBond {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Column(name = "series_name", nullable = false) private String seriesName;
    @Column(name = "nse_symbol") private String nseSymbol;
    private String isin;
    @Column(name = "subscription_date") private LocalDate subscriptionDate;
    @Column(name = "settlement_date") private LocalDate settlementDate;
    @Column(name = "issue_price") private BigDecimal issuePrice;
    @Column(name = "current_price") private BigDecimal currentPrice;
    @Column(name = "quantity_grams") private BigDecimal quantityGrams;
    @Column(name = "invested_amount") private BigDecimal investedAmount;
    @Column(name = "maturity_date") private LocalDate maturityDate;
    private BigDecimal roi;
    @Column(name = "interest_payout") private String interestPayout;
    @Column(name = "interest_payout_dates", columnDefinition = "TEXT") private String interestPayoutDates;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @PrePersist void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate  void onUpdate() { updatedAt = LocalDateTime.now(); }
}
