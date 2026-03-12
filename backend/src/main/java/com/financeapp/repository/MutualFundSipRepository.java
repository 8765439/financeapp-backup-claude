package com.financeapp.repository;

import com.financeapp.entity.MutualFundSip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface MutualFundSipRepository extends JpaRepository<MutualFundSip, Long> {
    List<MutualFundSip> findByUserIdAndIsActive(Long userId, Boolean isActive);
    List<MutualFundSip> findByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(m.monthlySip), 0) FROM MutualFundSip m WHERE m.userId = :uid AND m.isActive = true")
    Optional<BigDecimal> sumMonthlyActiveSip(@Param("uid") Long userId);
}
