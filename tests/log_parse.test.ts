import { parseLogs, printLogs, parseAndPrintLogs} from "../src/index";
import "mocha";
import { expect } from "chai";

const simpleLogs = [
    "Program Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS invoke [1]",
    "Program log: Instruction: Benchmark",
    "Program log: Bench: FindProgramAddress",
    "Program consumption: 198831 units remaining",
    "Program consumption: 194243 units remaining",
    "Program Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS consumed 26938 of 200000 compute units",
    "Program Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS success"
]

const nestedLogs = [
    "Program Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS invoke [1]",
    "Program log: Instruction: Benchmark",
    "Program log: Bench: Wrapper Bench",
    "Program consumption: 198860 units remaining",
    "Program log: Bench: FindProgramAddress",
    "Program consumption: 198831 units remaining",
    "Program consumption: 194243 units remaining",
    "Program log: Bench: PubkeyFromString",
    "Program consumption: 194216 units remaining",
    "Program log: Pubkey: C8mgrCncLMtpfh4QzkJsPfrWd384yQeSYpdujw4LF53T",
    "Program consumption: 174269 units remaining",
    "Program log: Log something else",
    "Program consumption: 174247 units remaining",
    "Program Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS consumed 25938 of 200000 compute units",
    "Program Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS success"
]

const badLogs = [
    "Program Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS invoke [1]",
    "Program log: Instruction: Benchmark",
    "Program log: Bench: Wrapper Bench",
    "Program consumption: 198860 units remaining",
    "Program log: Bench: FindProgramAddress",
    "Program consumption: 198831 units remaining",
    //'Program consumption: 194243 units remaining',
    "Program log: Bench: PubkeyFromString",
    "Program consumption: 194216 units remaining",
    "Program log: Pubkey: C8mgrCncLMtpfh4QzkJsPfrWd384yQeSYpdujw4LF53T",
    "Program consumption: 173269 units remaining",
    "Program log: Log something else",
    "Program consumption: 173247 units remaining",
    "Program Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS consumed 26938 of 200000 compute units",
    "Program Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS success"
]

describe("Parsing solana logs", () => {

    it("should parse a simple set of log statements", () => {

        // msg!("Bench: FindProgramAddress");
        // solana_program::log::sol_log_compute_units(); // Begin findProgramAddressBench
        // solana_program::pubkey::Pubkey::find_program_address(&[b"foo"],&ctx.accounts.signer.key());
        // solana_program::log::sol_log_compute_units(); // End findProgramAddressBench

        const parsedLogs = parseLogs(simpleLogs)
        expect(parsedLogs.children.length).eq(1)
        expect(parsedLogs.children[0].name).eq("FindProgramAddress")
    })

    it("should allow for nested log statements", () => {

        // msg!("Bench: Wrapper Bench");
        // solana_program::log::sol_log_compute_units();

        // msg!("Bench: FindProgramAddress");
        // solana_program::log::sol_log_compute_units(); // Begin findProgramAddressBench
        // solana_program::pubkey::Pubkey::find_program_address(&[b"foo"],&ctx.accounts.signer.key());
        // solana_program::log::sol_log_compute_units(); // End findProgramAddressBench

        // msg!("Bench: PubkeyFromString");
        // solana_program::log::sol_log_compute_units(); // Begin pubkeyFromString
        // let pubkey = Pubkey::from_str(PUBKEY_STR).unwrap();
        // msg!("Pubkey: {}", pubkey.to_string());
        // solana_program::log::sol_log_compute_units(); // End pubkeyFromString

        // msg!("Log something else");

        // solana_program::log::sol_log_compute_units(); // End Wrapper Bench

        const parsedLogs = parseLogs(nestedLogs)
        console.log(JSON.stringify(parsedLogs, null, 2));
        expect(parsedLogs.children[0].children.length).eq(2)
        expect(parsedLogs.children[0].children[1].name).eq("PubkeyFromString")
        printLogs(parsedLogs, {verbosity: 2})
    })

    it("should fail to parse logs where number of benchmark statements is not a multiple of 2", () => {
        try {
            parseLogs(badLogs)
        } catch (err) {
            expect(true).eq(true);
        }
    })

    it("should include a helper method to parse and print in one call", () => {
        parseAndPrintLogs(nestedLogs)
        expect(true).eq(true);
    })
})
