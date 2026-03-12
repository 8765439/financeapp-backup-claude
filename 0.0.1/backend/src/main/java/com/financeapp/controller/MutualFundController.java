package com.financeapp.controller;

import com.financeapp.entity.MutualFundSip;
import com.financeapp.entity.User;
import com.financeapp.repository.MutualFundSipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mf")
@RequiredArgsConstructor
public class MutualFundController {

    private final MutualFundSipRepository mfRepo;

    @GetMapping
    public ResponseEntity<List<MutualFundSip>> getAll(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(mfRepo.findByUserId(uid(ud)));
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@AuthenticationPrincipal UserDetails ud) {
        Long id = uid(ud);
        BigDecimal monthly = mfRepo.sumMonthlyActiveSip(id).orElse(BigDecimal.ZERO);
        Map<String, BigDecimal> byAmc = new LinkedHashMap<>();
        mfRepo.findByUserId(id).forEach(m -> {
            String key = m.getAmc() == null ? "Other" : m.getAmc();
            byAmc.merge(key, m.getMonthlySip() == null ? BigDecimal.ZERO : m.getMonthlySip(), BigDecimal::add);
        });
        return ResponseEntity.ok(Map.of(
            "totalMonthlySip", monthly,
            "totalAnnualSip",  monthly.multiply(BigDecimal.valueOf(12)),
            "byAmc",           byAmc
        ));
    }

    @PostMapping
    public ResponseEntity<MutualFundSip> create(@AuthenticationPrincipal UserDetails ud,
                                                 @RequestBody MutualFundSip mf) {
        mf.setUserId(uid(ud));
        return ResponseEntity.ok(mfRepo.save(mf));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MutualFundSip> update(@PathVariable Long id,
                                                 @RequestBody MutualFundSip mf,
                                                 @AuthenticationPrincipal UserDetails ud) {
        mf.setId(id);
        mf.setUserId(uid(ud));
        return ResponseEntity.ok(mfRepo.save(mf));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mfRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Long uid(UserDetails ud) { return ((User) ud).getId(); }
}
