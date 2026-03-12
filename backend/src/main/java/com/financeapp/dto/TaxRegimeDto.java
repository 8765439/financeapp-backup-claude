package com.financeapp.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TaxRegimeDto {
    private String regime;
    private BigDecimal netTaxableIncome;
    private BigDecimal incomeTax;
    private BigDecimal surcharge;
    private BigDecimal cess;
    private BigDecimal totalTax;
    private BigDecimal balanceDue;
}
