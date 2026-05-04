package com.fpml.cdm.fx.mapper;

import java.nio.file.Path;

public record RuntimeArgs(Path inputPath, Path outputPath, Path reportsDir) {
    public static RuntimeArgs parse(String[] args) {
        if (args.length != 5 || !"--output".equals(args[1]) || !"--reports".equals(args[3])) {
            throw new IllegalArgumentException(
                "Usage: java -jar target/fpml-cdm-mapper.jar <input.xml> --output <output.json> --reports <reportsDir>"
            );
        }
        return new RuntimeArgs(Path.of(args[0]), Path.of(args[2]), Path.of(args[4]));
    }
}
