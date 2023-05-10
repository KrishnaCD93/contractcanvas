pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template BidValidity() {
    signal input maxBudget;
    signal input acceptedPrice;

    signal output validBid;

    // Check if the accepted price is less than or equal to the project's maximum budget
    component priceComparator = LessEqThan(32);
    priceComparator.in[0] <== acceptedPrice;
    priceComparator.in[1] <== maxBudget;
    priceComparator.out ==> validBid;
}

component main = BidValidity();
