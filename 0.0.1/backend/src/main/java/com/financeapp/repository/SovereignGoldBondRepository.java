package com.financeapp.repository;

import com.financeapp.entity.SovereignGoldBond;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SovereignGoldBondRepository extends JpaRepository<SovereignGoldBond, Long> {
    List<SovereignGoldBond> findByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(s.quantityGrams), 0) FROM SovereignGoldBond s WHERE s.userId = :uid")
    Optional<BigDecimal> sumGrams(@Param("uid") Long userId);

    @Query("SELECT COALESCE(SUM(s.investedAmount), 0) FROM SovereignGoldBond s WHERE s.userId = :uid")
    Optional<BigDecimal> sumInvested(@Param("uid") Long userId);
}
