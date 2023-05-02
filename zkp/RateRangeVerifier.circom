pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template RateRangeVerifier() {
    signal input value;
    signal input min;
    signal input max;

    signal output isValid;

    GreaterEqThan() gteMin;
    LessEqThan() lteMax;
    AND() andGate;

    gteMin.A <== value;
    gteMin.B <== min;

    lteMax.A <== value;
    lteMax.B <== max;

    andGate.in1 <== gteMin.C;
    andGate.in2 <== lteMax.C;

    isValid <== andGate.out;
}

component main = RateRangeVerifier();
