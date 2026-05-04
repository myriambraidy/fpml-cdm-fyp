package com.fpml.validator;

import cdm.event.common.Trade;
import cdm.event.common.TradeState;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Guice;
import com.regnosys.rosetta.common.hashing.ReferenceResolverProcessStep;
import com.regnosys.rosetta.common.serialisation.RosettaObjectMapper;
import com.regnosys.rosetta.common.validation.RosettaTypeValidator;
import com.regnosys.rosetta.common.validation.ValidationReport;
import java.nio.file.Files;
import java.nio.file.Path;
import org.finos.cdm.CdmRuntimeModule;
import org.isda.cdm.processor.CdmReferenceConfig;

public final class RosettaValidatorCli {
    private RosettaValidatorCli() {
    }

    public static void main(String[] args) {
        try {
            CliArgs cliArgs = CliArgs.parse(args);
            ValidationReport report = validate(cliArgs);
            System.out.println(ValidationResultJson.render(report));
            System.exit(report.success() ? 0 : 1);
        } catch (Exception error) {
            System.err.println(error.getMessage());
            System.exit(2);
        }
    }

    private static ValidationReport validate(CliArgs cliArgs) throws Exception {
        ObjectMapper mapper = RosettaObjectMapper.getNewRosettaObjectMapper();
        JsonNode root = mapper.readTree(Files.readString(cliArgs.path));
        RosettaTypeValidator validator = Guice
            .createInjector(new CdmRuntimeModule())
            .getInstance(RosettaTypeValidator.class);

        if ("tradeState".equals(cliArgs.type)) {
            TradeState.TradeStateBuilder builder = mapper.treeToValue(root, TradeState.class).toBuilder();
            new ReferenceResolverProcessStep(CdmReferenceConfig.get()).runProcessStep(TradeState.class, builder);
            return validator.runProcessStep(TradeState.class, builder);
        }

        JsonNode tradeNode = root.has("trade") ? root.get("trade") : root;
        Trade.TradeBuilder builder = mapper.treeToValue(tradeNode, Trade.class).toBuilder();
        new ReferenceResolverProcessStep(CdmReferenceConfig.get()).runProcessStep(Trade.class, builder);
        return validator.runProcessStep(Trade.class, builder);
    }

    private static final class CliArgs {
        private final Path path;
        private final String type;

        private CliArgs(Path path, String type) {
            this.path = path;
            this.type = type;
        }

        private static CliArgs parse(String[] args) {
            if (args.length != 1 && args.length != 3) {
                throw new IllegalArgumentException(
                    "Usage: java -jar rosetta-validator-1.0.0.jar <cdm.json> [--type trade|tradeState]"
                );
            }
            String validationType = "trade";
            if (args.length == 3) {
                if (!"--type".equals(args[1])) {
                    throw new IllegalArgumentException("Expected --type before validation type.");
                }
                if (!"trade".equals(args[2]) && !"tradeState".equals(args[2])) {
                    throw new IllegalArgumentException("Validation type must be trade or tradeState.");
                }
                validationType = args[2];
            }
            return new CliArgs(Path.of(args[0]), validationType);
        }
    }
}
