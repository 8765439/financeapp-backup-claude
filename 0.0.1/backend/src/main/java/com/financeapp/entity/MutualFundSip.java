package com.financeapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "mutual_fund_sips")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MutualFundSip {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Column(name = "fund_name", nullable = false) private String fundName;
    private String amc;
    @Column(name = "fund_category") private String fundCategory;
    @Column(name = "monthly_sip") private BigDecimal monthlySip;
    @Column(name = "folio_number") private String folioNumber;
    @Column(name = "is_active") private Boolean isActive;
    @Column(name = "start_date") private LocalDate startDate;
    @Column(name = "units_held") private BigDecimal unitsHeld;
    private BigDecimal nav;
    private String notes;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @PrePersist void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate  void onUpdate() { updatedAt = LocalDateTime.now(); }
}
