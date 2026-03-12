package com.financeapp.repository;

import com.financeapp.entity.HomeLoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HomeLoanRepository extends JpaRepository<HomeLoan, Long> {
    List<HomeLoan> findByUserId(Long userId);
}
