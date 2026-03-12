package com.financeapp.service;

import com.financeapp.dto.DashboardDto;
import com.financeapp.entity.*;
import com.financeapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SalarySlipRepository        salaryRepo;
    private final TaxDeductionRepository      taxDedRepo;
    private final FixedDepositRepository      fdRepo;
    private final SovereignGoldBondRepository sgbRepo;
    private final MutualFundSipRepository     mfRepo;
    private final HomeLoanRepository          hlRepo;
    private final TaxCalculationService       taxService;

    public DashboardDto getDashboard(Long userId, String financialYear) {

        // ── Salary ──────────────────────────────────────────────────────
        BigDecimal grossSalary = salaryRepo.sumGrossSalary(userId, financialYear)
                                           .orElse(BigDecimal.ZERO);
        BigDecimal taxPaid     = salaryRepo.sumIncomeTaxPaid(userId, financialYear)
                                           .orElse(BigDecimal.ZERO);

        // ── Deductions ───────────────────────────────────────────────────
        TaxDeduction ded = taxDedRepo.findByUserIdAndFinancialYear(userId, financialYear)
                                      .orElse(new TaxDeduction());

        BigDecimal sec80cProd = safe(ded.getEpfEmployee())
            .add(safe(ded.getVpf()))
            .add(safe(ded.getPpf()))
            .add(safe(ded.getElss()))
            .add(safe(ded.getHomeLoanPrincipal()))
            .add(safe(ded.getInsurancePremium()));

        BigDecimal npsEmp   = safe(ded.getNpsEmployee80ccd1());
        BigDecimal npsEmplr = safe(ded.getNpsEmployer80ccd2());
        BigDecimal hlInt    = safe(ded.getHomeLoanInterest24b());
        BigDecimal sbInt    = safe(ded.getSbInterest80tta());
        BigDecimal profTax  = BigDecimal.valueOf(2400);
        BigDecimal otherInc = safe(ded.getOtherIncome());
        BigDecimal hpLoss   = hlInt.negate().min(BigDecimal.valueOf(-150000));

        // ── Tax ──────────────────────────────────────────────────────────
        TaxCalculationService.TaxResult oldR = taxService.computeOldRegime(
            grossSalary, otherInc, hpLoss, sec80cProd, npsEmp, npsEmplr, hlInt, sbInt, profTax, BigDecimal.ZERO);
        TaxCalculationService.TaxResult newR = taxService.computeNewRegime(
            grossSalary, otherInc, npsEmplr);

        BigDecimal balanceOld = oldR.totalTax().subtract(taxPaid);
        BigDecimal balanceNew = newR.totalTax().subtract(taxPaid);
        String recommended    = newR.totalTax().compareTo(oldR.totalTax()) < 0 ? "NEW" : "OLD";
        BigDecimal saving     = oldR.totalTax().subtract(newR.totalTax()).abs();

        // ── FD ───────────────────────────────────────────────────────────
        BigDecimal fdPrincipal = fdRepo.sumActivePrincipal(userId).orElse(BigDecimal.ZERO);
        int curYear = LocalDate.now().getYear();
        List<FixedDeposit> fdsMaturing = fdRepo.findMaturingBetween(userId,
            LocalDate.of(curYear, 1, 1), LocalDate.of(curYear, 12, 31));
        BigDecimal fdMaturing = fdsMaturing.stream()
            .map(FixedDeposit::getPrincipalAmount)
            .map(v -> v == null ? BigDecimal.ZERO : v)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // ── SGB ──────────────────────────────────────────────────────────
        List<SovereignGoldBond> sgbs = sgbRepo.findByUserId(userId);
        BigDecimal sgbGrams    = sgbRepo.sumGrams(userId).orElse(BigDecimal.ZERO);
        BigDecimal sgbInvested = sgbRepo.sumInvested(userId).orElse(BigDecimal.ZERO);

        BigDecimal sgbMarketVal = sgbs.stream()
            .map(s -> {
                BigDecimal price = s.getCurrentPrice() == null ? BigDecimal.ZERO : s.getCurrentPrice();
                BigDecimal grams = s.getQuantityGrams() == null ? BigDecimal.ZERO : s.getQuantityGrams();
                return price.multiply(grams);
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal sgbAnnualInt = sgbs.stream()
            .map(s -> {
                BigDecimal invested = s.getInvestedAmount() == null ? BigDecimal.ZERO : s.getInvestedAmount();
                BigDecimal roi      = s.getRoi() == null ? BigDecimal.ZERO : s.getRoi();
                return invested.multiply(roi).setScale(2, RoundingMode.HALF_UP);
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDate sgbNextMaturity = sgbs.stream()
            .map(SovereignGoldBond::getMaturityDate)
            .filter(d -> d != null && d.isAfter(LocalDate.now()))
            .min(LocalDate::compareTo)
            .orElse(null);

        // ── MF ───────────────────────────────────────────────────────────
        BigDecimal totalMonthlySip = mfRepo.sumMonthlyActiveSip(userId).orElse(BigDecimal.ZERO);

        // ── Home Loan ─────────────────────────────────────────────────────
        Optional<HomeLoan> hlOpt = hlRepo.findByUserId(userId).stream().findFirst();
        BigDecimal hlSanctioned  = hlOpt.map(HomeLoan::getSanctionedAmount).orElse(BigDecimal.ZERO);
        BigDecimal hlDisbursed   = hlOpt.map(HomeLoan::getDisbursedAmount).orElse(BigDecimal.ZERO);
        Integer    hlTenure      = hlOpt.map(HomeLoan::getTenureYears).orElse(0);

        return DashboardDto.builder()
            .financialYear(financialYear)
            .grossSalary(grossSalary)
            .otherIncome(otherInc)
            .netTaxableOld(oldR.netTaxableIncome())
            .taxOld(oldR.taxOnIncome())
            .surchargeOld(oldR.surcharge())
            .cessOld(oldR.cess())
            .totalTaxOld(oldR.totalTax())
            .balanceDueOld(balanceOld)
            .netTaxableNew(newR.netTaxableIncome())
            .taxNew(newR.taxOnIncome())
            .surchargeNew(newR.surcharge())
            .cessNew(newR.cess())
            .totalTaxNew(newR.totalTax())
            .balanceDueNew(balanceNew)
            .taxPaid(taxPaid)
            .recommendedRegime(recommended)
            .taxSaving(saving)
            .sec80cProduced(sec80cProd)
            .sec80cAllowed(sec80cProd.min(BigDecimal.valueOf(150000)))
            .npsEmployee80ccd1(npsEmp)
            .npsEmployer80ccd2(npsEmplr)
            .homeLoanInterest24b(hlInt)
            .sbInterest80tta(sbInt)
            .fdTotalPrincipal(fdPrincipal)
            .fdMaturingThisYear(fdMaturing)
            .fdMaturingCount(fdsMaturing.size())
            .sgbCount(sgbs.size())
            .sgbTotalGrams(sgbGrams)
            .sgbTotalInvested(sgbInvested)
            .sgbMarketValue(sgbMarketVal)
            .sgbAnnualInterest(sgbAnnualInt)
            .sgbNextMaturity(sgbNextMaturity)
            .totalMonthlySip(totalMonthlySip)
            .totalAnnualSip(totalMonthlySip.multiply(BigDecimal.valueOf(12)))
            .hlSanctionedAmount(hlSanctioned)
            .hlDisbursedAmount(hlDisbursed)
            .hlTenureYears(hlTenure)
            .build();
    }

    private BigDecimal safe(BigDecimal val) {
        return val == null ? BigDecimal.ZERO : val;
    }
}
