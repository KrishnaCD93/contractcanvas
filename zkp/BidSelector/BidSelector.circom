pragma circom 2.1.0;

template BidComparator(n) {
    signal input {value} a[n];
    signal input {value} b[n];
    signal output {binary} out[n];
    
    for (var i = 0; i < n; i++) {
        out[i] <== a[i] <= b[i];
    }
}

template BidSelector(n) {
    signal input bidPrices[n];
    signal input highestValidBid;
    signal output selectedBid;
    
    component priceComparator = BidComparator(n);
    priceComparator.a <== bidPrices;
    for (var i = 0; i < n; i++) {
        priceComparator.b[i] <== highestValidBid;
    }
    
    var selectedBidIndex = 0;
    for (var i = 0; i < n; i++) {
        if (priceComparator.out[i] == 1) {
            selectedBidIndex = i;
        }
    }
    
    selectedBid <== bidPrices[selectedBidIndex];
}

component main = BidSelector(5);
