package com.fpml.cdm.fx.mapper.generated;

import cdm.event.common.Trade;
import cdm.event.common.TradeState;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import java.nio.file.Files;
import java.nio.file.Path;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;

public class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String mapFile(Path inputPath, Path reportsDir) throws Exception {
        Files.createDirectories(reportsDir);
        Document document = DocumentBuilderFactory.newInstance()
            .newDocumentBuilder()
            .parse(inputPath.toFile());
        TradeState tradeState = mapTradeState(document, reportsDir);
        return objectMapper.writeValueAsString(tradeState);
    }

    private TradeState mapTradeState(Document document, Path reportsDir) throws Exception {
        writeUnsupportedReport(reportsDir, "Generated skeleton has not implemented full FX mapping yet.");
        Trade trade = Trade.builder().build();
        return TradeState.builder().setTrade(trade).build();
    }

    private void writeUnsupportedReport(Path reportsDir, String message) throws Exception {
        Files.writeString(reportsDir.resolve("unsupported-fields-report.txt"), message);
    }
}
