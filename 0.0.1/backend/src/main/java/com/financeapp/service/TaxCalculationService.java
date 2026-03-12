package com.financeapp.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Implements Indian Income Tax computation for FY 2025-26
 * Old Regime: slabs with deductions
 * New Regime: lower slabs, no most deductions (except NPS employer 80CCD2)
 */
@Service
public class TaxCalculationService {

    private static final BigDecimal CESS_RATE        = new BigDecimal("0.04");
    private static final BigDecimal STD_DED_OLD      = new BigDecimal("50000");
    private static final BigDecimal STD_DED_NEW      = new BigDecimal("75000");
    private static final BigDecimal SEC80C_LIMIT      = new BigDecimal("150000");
    private static final BigDecimal NPS_80CCD1_LIMIT  = new BigDecimal("50000");   // over 80C
    private static final BigDecimal HL_INTEREST_LIMIT = new BigDecimal("150000");
    private static final BigDecimal IITTA_LIMIT       = new BigDecimal("10000");

    // ── Old Regime slabs FY 2025-26 ──────────────────────────────────────
    public TaxResult computeOldRegime(
            BigDecimal grossSalary,
            BigDecimal otherIncome,
            BigDecimal housePropertyLoss,   // negative value = loss (benefit)
            BigDecimal sec80cProduced,
            BigDecimal npsEmployee80ccd1,   // separate from 80C
            BigDecimal npsEmployer80ccd2,
            BigDecimal homeLoanInterest24b,
            BigDecimal sbInterest80tta,
            BigDecimal professionTax,
            BigDecimal otherDeductions) {

        // Step 1: Gross Total Income
        BigDecimal grossAfterStd = grossSalary.subtract(STD_DED_OLD);
        BigDecimal hpIncome      = housePropertyLoss.compareTo(BigDecimal.ZERO) < 0
                                    ? housePropertyLoss : BigDecimal.ZERO; // max -150000
        BigDecimal gti           = grossAfterStd.add(otherIncome).add(hpIncome);

        // Step 2: Chapter VI-A deductions
        BigDecimal sec80c = sec80cProduced.min(SEC80C_LIMIT);
        BigDecimal nps    = npsEmployee80ccd1.min(NPS_80CCD1_LIMIT);
        BigDecimal hl     = homeLoanInterest24b.min(HL_INTEREST_LIMIT);
        BigDecimal iitta  = sbInterest80tta.min(IITTA_LIMIT);
        BigDecimal viaDed = sec80c.add(nps).add(npsEmployer80ccd2)
                                  .add(professionTax).add(otherDeductions);

        BigDecimal netTaxableOld = gti.subtract(viaDed).max(BigDecimal.ZERO);

        BigDecimal taxOnIncome = slabTaxOld(netTaxableOld);
        BigDecimal surcharge   = computeSurcharge(taxOnIncome, netTaxableOld, false);
        BigDecimal cess        = taxOnIncome.add(surcharge).multiply(CESS_RATE)
                                            .setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalTax    = taxOnIncome.add(surcharge).add(cess)
                                            .setScale(2, RoundingMode.HALF_UP);

        return new TaxResult(netTaxableOld, taxOnIncome, surcharge, cess, totalTax, "OLD");
    }

    // ── New Regime slabs FY 2025-26 ──────────────────────────────────────
    public TaxResult computeNewRegime(
            BigDecimal grossSalary,
            BigDecimal otherIncome,
            BigDecimal npsEmployer80ccd2) {

        BigDecimal grossAfterStd = grossSalary.subtract(STD_DED_NEW);
        BigDecimal gti           = grossAfterStd.add(otherIncome);
        BigDecimal netTaxableNew = gti.subtract(npsEmployer80ccd2).max(BigDecimal.ZERO);

        BigDecimal taxOnIncome = slabTaxNew(netTaxableNew);
        BigDecimal surcharge   = computeSurcharge(taxOnIncome, netTaxableNew, true);
        BigDecimal cess        = taxOnIncome.add(surcharge).multiply(CESS_RATE)
                                            .setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalTax    = taxOnIncome.add(surcharge).add(cess)
                                            .setScale(2, RoundingMode.HALF_UP);

        return new TaxResult(netTaxableNew, taxOnIncome, surcharge, cess, totalTax, "NEW");
    }

    // ── Slab calculators ─────────────────────────────────────────────────

    /** Old regime slabs (unchanged for FY 2025-26 in old regime) */
    private BigDecimal slabTaxOld(BigDecimal income) {
        // Up to 2.5L: 0%  | 2.5L-5L: 5% | 5L-10L: 20% | >10L: 30%
        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal rem = income;
        BigDecimal[] limits = { bd("250000"), bd("250000"), bd("500000") };
        BigDecimal[] rates  = { bd("0.00"),   bd("0.05"),   bd("0.20") };

        for (int i = 0; i < limits.length && rem.compareTo(BigDecimal.ZERO) > 0; i++) {
            BigDecimal slice = rem.min(limits[i]);
            tax = tax.add(slice.multiply(rates[i]));
            rem = rem.subtract(slice);
        }
        if (rem.compareTo(BigDecimal.ZERO) > 0) {
            tax = tax.add(rem.multiply(bd("0.30")));
        }
        // 87A rebate: if income ≤ 5L, tax = 0
        if (income.compareTo(bd("500000")) <= 0) tax = BigDecimal.ZERO;
        return tax.setScale(2, RoundingMode.HALF_UP);
    }

    /** New regime slabs FY 2025-26 */
    private BigDecimal slabTaxNew(BigDecimal income) {
        // 0-4L: 0% | 4-8L: 5% | 8-12L: 10% | 12-16L: 15% | 16-20L: 20% | 20-24L: 25% | >24L: 30%
        BigDecimal[] limits = { bd("400000"), bd("400000"), bd("400000"), bd("400000"), bd("400000"), bd("400000") };
        BigDecimal[] rates  = { bd("0.00"),   bd("0.05"),   bd("0.10"),   bd("0.15"),   bd("0.20"),   bd("0.25") };
        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal rem = income;

        for (int i = 0; i < limits.length && rem.compareTo(BigDecimal.ZERO) > 0; i++) {
            BigDecimal slice = rem.min(limits[i]);
            tax = tax.add(slice.multiply(rates[i]));
            rem = rem.subtract(slice);
        }
        if (rem.compareTo(BigDecimal.ZERO) > 0) {
            tax = tax.add(rem.multiply(bd("0.30")));
        }
        // 87A rebate: if income ≤ 12L, tax = 0
        if (income.compareTo(bd("1200000")) <= 0) tax = BigDecimal.ZERO;
        return tax.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal computeSurcharge(BigDecimal tax, BigDecimal income, boolean isNew) {
        if (income.compareTo(bd("5000000")) <= 0) return BigDecimal.ZERO;
        BigDecimal rate;
        if      (income.compareTo(bd("10000000")) <= 0) rate = bd("0.10");
        else if (income.compareTo(bd("20000000")) <= 0) rate = bd("0.15");
        else if (income.compareTo(bd("50000000")) <= 0) rate = bd(isNew ? "0.25" : "0.25");
        else                                             rate = bd(isNew ? "0.25" : "0.37");
        return tax.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal bd(String val) { return new BigDecimal(val); }

    // ── Result record ─────────────────────────────────────────────────────
    public record TaxResult(
        BigDecimal netTaxableIncome,
        BigDecimal taxOnIncome,
        BigDecimal surcharge,
        BigDecimal cess,
        BigDecimal totalTax,
        String regime
    ) {}
}
