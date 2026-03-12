package com.financeapp.controller;

import com.financeapp.entity.TaxDeduction;
import com.financeapp.entity.User;
import com.financeapp.repository.TaxDeductionRepository;
import com.financeapp.repository.SalarySlipRepository;
import com.financeapp.service.TaxCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/tax")
@RequiredArgsConstructor
public class TaxController {

    private final TaxCalculationService  taxService;
    private final TaxDeductionRepository taxDedRepo;
    private final SalarySlipRepository   salaryRepo;

    @PostMapping("/compute")
    public ResponseEntity<?> compute(@RequestBody Map<String, Object> body) {
        BigDecimal gross    = bd(body, "grossSalary",     "0");
        BigDecimal other    = bd(body, "otherIncome",     "0");
        BigDecimal sec80c   = bd(body, "sec80c",          "0");
        BigDecimal npsEmp   = bd(body, "npsEmployee",     "0");
        BigDecimal npsEmplr = bd(body, "npsEmployer",     "0");
        BigDecimal hlInt    = bd(body, "homeLoanInterest","0");
        BigDecimal sbInt    = bd(body, "sbInterest",      "0");
        BigDecimal profTax  = bd(body, "professionTax",   "2400");
        BigDecimal hpLoss   = hlInt.negate().min(BigDecimal.valueOf(-150000));

        TaxCalculationService.TaxResult old = taxService.computeOldRegime(
            gross, other, hpLoss, sec80c, npsEmp, npsEmplr, hlInt, sbInt, profTax, BigDecimal.ZERO);
        TaxCalculationService.TaxResult neo = taxService.computeNewRegime(gross, other, npsEmplr);

        return ResponseEntity.ok(Map.of(
            "oldRegime", Map.of(
                "netTaxable", old.netTaxableIncome(), "tax", old.taxOnIncome(),
                "surcharge",  old.surcharge(),          "cess", old.cess(),
                "totalTax",   old.totalTax()),
            "newRegime", Map.of(
                "netTaxable", neo.netTaxableIncome(), "tax", neo.taxOnIncome(),
                "surcharge",  neo.surcharge(),          "cess", neo.cess(),
                "totalTax",   neo.totalTax()),
            "recommended", neo.totalTax().compareTo(old.totalTax()) < 0 ? "NEW" : "OLD",
            "saving",      old.totalTax().subtract(neo.totalTax()).abs()
        ));
    }

    @GetMapping("/deductions")
    public ResponseEntity<?> getDeductions(@AuthenticationPrincipal UserDetails ud,
                                            @RequestParam(defaultValue = "2025-26") String fy) {
        return taxDedRepo.findByUserIdAndFinancialYear(uid(ud), fy)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElse(ResponseEntity.ok(new TaxDeduction()));
    }

    @PostMapping("/deductions")
    public ResponseEntity<TaxDeduction> saveDeductions(@AuthenticationPrincipal UserDetails ud,
                                                        @RequestBody TaxDeduction ded) {
        ded.setUserId(uid(ud));
        return ResponseEntity.ok(taxDedRepo.save(ded));
    }

    private BigDecimal bd(Map<String, Object> m, String key, String def) {
        return new BigDecimal(m.getOrDefault(key, def).toString());
    }

    private Long uid(UserDetails ud) { return ((User) ud).getId(); }
}
