package com.financeapp.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TaxComparisonDto {
    private String financialYear;
    private BigDecimal grossSalary;
    private String recommendedRegime;
    private BigDecimal saving;
    private BigDecimal taxAlreadyPaid;
    private TaxRegimeDto oldRegime;
    private TaxRegimeDto newRegime;
}
