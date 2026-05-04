package com.fpml.cdm.fx.mapper.generated;

import cdm.base.staticdata.identifier.Identifier;

/**
 * Helper class for assigned identifier construction.
 */
public class AssignedIdentifier {
    private Identifier identifier;

    public static AssignedIdentifier builder() {
        return new AssignedIdentifier();
    }

    public AssignedIdentifier setIdentifier(Identifier identifier) {
        this.identifier = identifier;
        return this;
    }

    public Identifier getIdentifier() {
        return identifier;
    }
}
