package com.financeapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "tax_deductions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaxDeduction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Column(name = "financial_year") private String financialYear;
    @Column(name = "epf_employee")      private BigDecimal epfEmployee;
    private BigDecimal vpf;
    private BigDecimal ppf;
    private BigDecimal nsc;
    private BigDecimal elss;
    @Column(name = "home_loan_principal") private BigDecimal homeLoanPrincipal;
    @Column(name = "insurance_premium")   private BigDecimal insurancePremium;
    @Column(name = "tuition_fees")        private BigDecimal tuitionFees;
    @Column(name = "sec80c_total")        private BigDecimal sec80cTotal;
    @Column(name = "nps_employee_80ccd1") private BigDecimal npsEmployee80ccd1;
    @Column(name = "nps_employer_80ccd2") private BigDecimal npsEmployer80ccd2;
    @Column(name = "home_loan_interest_24b") private BigDecimal homeLoanInterest24b;
    @Column(name = "sb_interest_80tta")   private BigDecimal sbInterest80tta;
    @Column(name = "medical_insurance_80d") private BigDecimal medicalInsurance80d;
    @Column(name = "donation_80g")        private BigDecimal donation80g;
    @Column(name = "other_deductions")    private BigDecimal otherDeductions;
    @Column(name = "savings_bank_interest") private BigDecimal savingsBankInterest;
    @Column(name = "fd_interest")         private BigDecimal fdInterest;
    @Column(name = "other_income")        private BigDecimal otherIncome;
    @Column(name = "hl_loan_taken_after_1999") private Boolean hlLoanTakenAfter1999;
    @Column(name = "hl_sec80eea_eligible") private Boolean hlSec80eeaEligible;
}
