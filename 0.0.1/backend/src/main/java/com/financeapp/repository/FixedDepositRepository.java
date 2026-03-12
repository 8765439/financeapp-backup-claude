package com.financeapp.repository;

import com.financeapp.entity.FixedDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {
    List<FixedDeposit> findByUserIdAndIsActive(Long userId, Boolean isActive);
    List<FixedDeposit> findByUserId(Long userId);

    @Query("SELECT fd FROM FixedDeposit fd WHERE fd.userId = :uid AND fd.isActive = true " +
           "AND fd.maturityDate BETWEEN :from AND :to")
    List<FixedDeposit> findMaturingBetween(@Param("uid") Long userId,
                                            @Param("from") LocalDate from,
                                            @Param("to") LocalDate to);

    @Query("SELECT COALESCE(SUM(fd.principalAmount), 0) FROM FixedDeposit fd WHERE fd.userId = :uid AND fd.isActive = true")
    Optional<BigDecimal> sumActivePrincipal(@Param("uid") Long userId);
}
