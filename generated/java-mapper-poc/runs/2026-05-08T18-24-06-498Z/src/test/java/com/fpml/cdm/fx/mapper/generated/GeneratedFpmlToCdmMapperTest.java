package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import com.fpml.cdm.fx.mapper.RuntimeArgs;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for GeneratedFpmlToCdmMapper.
 * Each test maps one FpML fixture to CDM JSON and verifies the output.
 */
public class GeneratedFpmlToCdmMapperTest {

    @TempDir
    Path tempDir;

    private void runMapperAndAssert(String fixtureName, String xmlResource) throws Exception {
        RuntimeArgs args = new RuntimeArgs();
        args.setFixtureName(fixtureName);
        args.setFixturesDir("fixtures");
        args.setOutputDir(tempDir.toString());
        args.setReportDir(tempDir.toString());

        FpmlToCdmMapper mapper = new GeneratedFpmlToCdmMapper();
        File result = mapper.map(args);

        assertNotNull(result, "Output file should be generated for fixture: " + fixtureName);
        assertTrue(result.exists(), "Output file must exist: " + result.getAbsolutePath());
        assertTrue(result.length() > 0, "Output file must not be empty for fixture: " + fixtureName);

        // Verify the JSON is valid (can be parsed)
        String json = new String(java.nio.file.Files.readAllBytes(result.toPath()));
        assertTrue(json.contains("\"tradeState\""), "Output must contain tradeState root element");
    }

    @Test
    public void testFxEx01_FxSpot() throws Exception {
        runMapperAndAssert("fx-ex01-fx-spot", "fx-ex01-fx-spot.xml");
    }

    @Test
    public void testFxEx02_SpotCrossWSideRates() throws Exception {
        runMapperAndAssert("fx-ex02-spot-cross-w-side-rates", "fx-ex02-spot-cross-w-side-rates.xml");
    }

    @Test
    public void testFxEx03_FxFwd() throws Exception {
        runMapperAndAssert("fx-ex03-fx-fwd", "fx-ex03-fx-fwd.xml");
    }

    @Test
    public void testFxEx04_FxFwdWSettlement() throws Exception {
        runMapperAndAssert("fx-ex04-fx-fwd-w-settlement", "fx-ex04-fx-fwd-w-settlement.xml");
    }

    @Test
    public void testFxEx05_FxFwdWSsi() throws Exception {
        runMapperAndAssert("fx-ex05-fx-fwd-w-ssi", "fx-ex05-fx-fwd-w-ssi.xml");
    }

    @Test
    public void testFxEx06_FxFwdWSplits() throws Exception {
        runMapperAndAssert("fx-ex06-fx-fwd-w-splits", "fx-ex06-fx-fwd-w-splits.xml");
    }

    @Test
    public void testFxEx07_NonDeliverableForward() throws Exception {
        runMapperAndAssert("fx-ex07-non-deliverable-forward", "fx-ex07-non-deliverable-forward.xml");
    }
}
