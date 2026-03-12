package com.financeapp.controller;

import com.financeapp.entity.SalarySlip;
import com.financeapp.entity.User;
import com.financeapp.repository.SalarySlipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/salary")
@RequiredArgsConstructor
public class SalaryController {

    private final SalarySlipRepository salaryRepo;

    @GetMapping("/slips")
    public ResponseEntity<List<SalarySlip>> getSlips(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue = "2025-26") String fy) {
        return ResponseEntity.ok(salaryRepo.findByUserIdAndFinancialYearOrderByMonth(uid(ud), fy));
    }

    @PostMapping("/slips")
    public ResponseEntity<SalarySlip> saveSlip(@AuthenticationPrincipal UserDetails ud,
                                                @RequestBody SalarySlip slip) {
        slip.setUserId(uid(ud));
        return ResponseEntity.ok(salaryRepo.save(slip));
    }

    @DeleteMapping("/slips/{id}")
    public ResponseEntity<Void> deleteSlip(@PathVariable Long id) {
        salaryRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@AuthenticationPrincipal UserDetails ud,
                                         @RequestParam(defaultValue = "2025-26") String fy) {
        Long id = uid(ud);
        BigDecimal gross = salaryRepo.sumGrossSalary(id, fy).orElse(BigDecimal.ZERO);
        BigDecimal tax   = salaryRepo.sumIncomeTaxPaid(id, fy).orElse(BigDecimal.ZERO);
        return ResponseEntity.ok(Map.of("grossSalary", gross, "incomeTaxPaid", tax, "fy", fy));
    }

    private Long uid(UserDetails ud) { return ((User) ud).getId(); }
}
