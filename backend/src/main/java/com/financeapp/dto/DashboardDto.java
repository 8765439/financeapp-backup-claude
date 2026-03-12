package com.financeapp.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardDto {
    private String financialYear;
    private BigDecimal grossSalary;
    private BigDecimal otherIncome;
    // Old Regime
    private BigDecimal netTaxableOld;
    private BigDecimal taxOld;
    private BigDecimal surchargeOld;
    private BigDecimal cessOld;
    private BigDecimal totalTaxOld;
    private BigDecimal balanceDueOld;
    // New Regime
    private BigDecimal netTaxableNew;
    private BigDecimal taxNew;
    private BigDecimal surchargeNew;
    private BigDecimal cessNew;
    private BigDecimal totalTaxNew;
    private BigDecimal balanceDueNew;
    // Common
    private BigDecimal taxPaid;
    private String     recommendedRegime;
    private BigDecimal taxSaving;
    // Deductions
    private BigDecimal sec80cProduced;
    private BigDecimal sec80cAllowed;
    private BigDecimal npsEmployee80ccd1;
    private BigDecimal npsEmployer80ccd2;
    private BigDecimal homeLoanInterest24b;
    private BigDecimal sbInterest80tta;
    // FD
    private BigDecimal fdTotalPrincipal;
    private BigDecimal fdMaturingThisYear;
    private Integer    fdMaturingCount;
    // SGB
    private Integer    sgbCount;
    private BigDecimal sgbTotalGrams;
    private BigDecimal sgbTotalInvested;
    private BigDecimal sgbMarketValue;
    private BigDecimal sgbAnnualInterest;
    private LocalDate  sgbNextMaturity;
    // MF
    private BigDecimal totalMonthlySip;
    private BigDecimal totalAnnualSip;
    // Home Loan
    private BigDecimal hlSanctionedAmount;
    private BigDecimal hlDisbursedAmount;
    private Integer    hlTenureYears;
}
