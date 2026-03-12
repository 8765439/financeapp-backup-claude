package com.financeapp.repository;

import com.financeapp.entity.SalarySlip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalarySlipRepository extends JpaRepository<SalarySlip, Long> {
    List<SalarySlip> findByUserIdAndFinancialYearOrderByMonth(Long userId, String fy);
    Optional<SalarySlip> findByUserIdAndMonthAndFinancialYear(Long userId, String month, String fy);

    @Query("SELECT COALESCE(SUM(s.basic + s.personalAllowance + s.otherAllowance + s.hra + " +
           "COALESCE(s.onCallShiftAllowance,0) + COALESCE(s.variablePay,0) + " +
           "COALESCE(s.esppRefund,0) + COALESCE(s.leaveEncashment,0)), 0) " +
           "FROM SalarySlip s WHERE s.userId = :uid AND s.financialYear = :fy")
    Optional<BigDecimal> sumGrossSalary(@Param("uid") Long userId, @Param("fy") String fy);

    @Query("SELECT COALESCE(SUM(s.incomeTax), 0) FROM SalarySlip s WHERE s.userId = :uid AND s.financialYear = :fy")
    Optional<BigDecimal> sumIncomeTaxPaid(@Param("uid") Long userId, @Param("fy") String fy);
}
