pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/multiplexer.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template SelectiveDisclosure() {
    signal input rate;
    signal input rateDisclosed;

    signal input availability;
    signal input availabilityDisclosed;

    signal input skills;
    signal input skillsDisclosed;

    signal input resumeFileName;
    signal input resumeFileNameDisclosed;

    signal input exclusions;
    signal input exclusionsDisclosed;

    signal output disclosedRate;
    signal output disclosedAvailability;
    signal output disclosedSkills;
    signal output disclosedResumeFileName;
    signal output disclosedExclusions;

    signal output rateHash;
    signal output availabilityHash;
    signal output skillsHash;
    signal output resumeFileNameHash;
    signal output exclusionsHash;

    component rateSwitch = Multiplexer(1, 2);
    rateSwitch.inp[0][0] <== rate;
    rateSwitch.inp[1][0] <== 0;
    rateSwitch.sel <== rateDisclosed;
    rateSwitch.out[0] ==> disclosedRate;

    component availabilitySwitch = Multiplexer(1, 2);
    availabilitySwitch.inp[0][0] <== availability;
    availabilitySwitch.inp[1][0] <== 0;
    availabilitySwitch.sel <== availabilityDisclosed;
    availabilitySwitch.out[0] ==> disclosedAvailability;

    component skillsSwitch = Multiplexer(1, 2);
    skillsSwitch.inp[0][0] <== skills;
    skillsSwitch.inp[1][0] <== 0;
    skillsSwitch.sel <== skillsDisclosed;
    skillsSwitch.out[0] ==> disclosedSkills;

    component resumeFileNameSwitch = Multiplexer(1, 2);
    resumeFileNameSwitch.inp[0][0] <== resumeFileName;
    resumeFileNameSwitch.inp[1][0] <== 0;
    resumeFileNameSwitch.sel <== resumeFileNameDisclosed;
    resumeFileNameSwitch.out[0] ==> disclosedResumeFileName;

    component exclusionsSwitch = Multiplexer(1, 2);
    exclusionsSwitch.inp[0][0] <== exclusions;
    exclusionsSwitch.inp[1][0] <== 0;
    exclusionsSwitch.sel <== exclusionsDisclosed;
    exclusionsSwitch.out[0] ==> disclosedExclusions;

    component rateHasher = Poseidon(2);
    rateHasher.inputs[0] <== rate;
    rateHasher.inputs[1] <== rateDisclosed;
    rateHasher.out ==> rateHash;

    component availabilityHasher = Poseidon(2);
    availabilityHasher.inputs[0] <== availability;
    availabilityHasher.inputs[1] <== availabilityDisclosed;
    availabilityHasher.out ==> availabilityHash;

    component skillsHasher = Poseidon(2);
    skillsHasher.inputs[0] <== skills;
    skillsHasher.inputs[1] <== skillsDisclosed;
    skillsHasher.out ==> skillsHash;

    component resumeFileNameHasher = Poseidon(2);
    resumeFileNameHasher.inputs[0] <== resumeFileName;
    resumeFileNameHasher.inputs[1] <== resumeFileNameDisclosed;
    resumeFileNameHasher.out ==> resumeFileNameHash;
    component exclusionsHasher = Poseidon(2);
    exclusionsHasher.inputs[0] <== exclusions;
    exclusionsHasher.inputs[1] <== exclusionsDisclosed;
    exclusionsHasher.out ==> exclusionsHash;
}

component main = SelectiveDisclosure();
