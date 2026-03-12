package com.financeapp.repository;

import com.financeapp.entity.TaxDeduction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TaxDeductionRepository extends JpaRepository<TaxDeduction, Long> {
    Optional<TaxDeduction> findByUserIdAndFinancialYear(Long userId, String fy);
}
