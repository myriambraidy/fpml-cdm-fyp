package com.fpml.cdm.fx.recipefixtures;

public final class RecipeStep3BuilderMethodsFixture {
  public void verify() {
    var builder0 = cdm.product.template.NonTransferableProduct.builder();
    builder0.getEconomicTerms();
    builder0.getEconomicTerms();
    builder0.getOrCreateEconomicTerms();
    builder0.setEconomicTerms(null);
    var builder1 = cdm.product.template.Product.builder();
    builder1.getNonTransferableProduct();
    builder1.getNonTransferableProduct();
    builder1.getOrCreateNonTransferableProduct();
    builder1.getOrCreateTransferableProduct();
    builder1.getTransferableProduct();
    builder1.getTransferableProduct();
    builder1.setNonTransferableProduct(null);
    builder1.setTransferableProduct(null);
    var builder2 = cdm.product.template.TradableProduct.builder();
    builder2.getOrCreateProduct();
    builder2.getProduct();
    builder2.getProduct();
    builder2.setProduct(null);
  }
}
