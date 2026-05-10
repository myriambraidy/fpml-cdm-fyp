package com.fpml.cdm.fx.mapper;

import com.fpml.cdm.fx.mapper.generated.GeneratedFpmlToCdmMapper;
import java.nio.file.Files;

public final class Main {
    private Main() {
    }

    public static void main(String[] args) throws Exception {
        RuntimeArgs runtimeArgs = RuntimeArgs.parse(args);
        FpmlToCdmMapper mapper = new GeneratedFpmlToCdmMapper();
        String cdmJson = mapper.mapFile(runtimeArgs.inputPath(), runtimeArgs.reportsDir());
        Files.writeString(runtimeArgs.outputPath(), cdmJson);
    }
}
