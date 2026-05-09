package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import java.nio.file.Files;
import java.nio.file.Path;

public final class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {
    @Override
    public String mapFile(Path inputPath, Path reportsDir) throws Exception {
        Files.createDirectories(reportsDir);
        Files.writeString(reportsDir.resolve("unsupported-scope.json"), "{\"status\":\"blocked\",\"reason\":\"Generated mapper fallback inserted because implementation files were not written.\"}");
        return "{}";
    }
}
