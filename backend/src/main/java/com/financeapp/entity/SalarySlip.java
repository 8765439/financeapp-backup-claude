package com.financeapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "salary_slips")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalarySlip {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Column(nullable = false, length = 3) private String month;
    @Column(name = "financial_year", nullable = false, length = 9) private String financialYear;
    // Earnings
    private BigDecimal basic;
    @Column(name = "personal_allowance") private BigDecimal personalAllowance;
    @Column(name = "other_allowance")    private BigDecimal otherAllowance;
    private BigDecimal hra;
    private BigDecimal lta;
    private BigDecimal exgratia;
    @Column(name = "on_call_shift_allowance") private BigDecimal onCallShiftAllowance;
    @Column(name = "variable_pay")   private BigDecimal variablePay;
    @Column(name = "espp_refund")    private BigDecimal esppRefund;
    @Column(name = "leave_encashment") private BigDecimal leaveEncashment;
    @Column(name = "misc_earnings")  private BigDecimal miscEarnings;
    // Deductions
    @Column(name = "pf_deduction")   private BigDecimal pfDeduction;
    @Column(name = "vpf_deduction")  private BigDecimal vpfDeduction;
    @Column(name = "nps_employer")   private BigDecimal npsEmployer;
    @Column(name = "income_tax")     private BigDecimal incomeTax;
    @Column(name = "profession_tax") private BigDecimal professionTax;
    @Column(name = "espp_deduction") private BigDecimal esppDeduction;
    private BigDecimal ehip;
    @Column(name = "ngo_contribution") private BigDecimal ngoContribution;
    @Column(name = "misc_deductions") private BigDecimal miscDeductions;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist void onCreate() { createdAt = LocalDateTime.now(); }
}
