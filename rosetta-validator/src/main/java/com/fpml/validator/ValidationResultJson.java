package com.fpml.validator;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.regnosys.rosetta.common.validation.ValidationReport;
import com.rosetta.model.lib.validation.ValidationResult;

public final class ValidationResultJson {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private ValidationResultJson() {
    }

    public static String render(ValidationReport report) throws Exception {
        ObjectNode root = MAPPER.createObjectNode();
        root.put("valid", report.success());
        ArrayNode failures = MAPPER.createArrayNode();
        for (ValidationResult<?> result : report.results()) {
            if (result.isSuccess()) {
                continue;
            }
            ObjectNode failure = MAPPER.createObjectNode();
            failure.put("name", stringValue(result.getName()));
            failure.put("type", stringValue(result.getValidationType()));
            failure.put("path", stringValue(result.getPath()));
            failure.put("definition", stringValue(result.getDefinition()));
            failure.put("failureMessage", result.getFailureReason().orElse(""));
            failure.put("failureCount", 1);
            failures.add(failure);
        }
        root.set("failures", failures);
        return MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(root);
    }

    private static String stringValue(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}
