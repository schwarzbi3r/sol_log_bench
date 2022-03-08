# sol_log_bench

Turns

```
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
```

into: 

![image](https://user-images.githubusercontent.com/61796571/157333991-d505ff0c-fcfa-4bd6-a193-7c25e09c4020.png)


## Usage

On the rust/Solana side of things

```rust
  // label the benchmark and wrap the code you want to benchmark in `sol_log_compute_units`
  msg!("Bench: FindProgramAddress");
  solana_program::log::sol_log_compute_units(); // Begin findProgramAddressBench

  // The code we want to benchmark
  solana_program::pubkey::Pubkey::find_program_address(&[b"foo"], &ctx.accounts.signer.key());

  solana_program::log::sol_log_compute_units(); // End findProgramAddressBench
```


On the test side of things:
```typescript
  import { parseAndPrintLogs } from 'sol_log_bench';

  ...

  await provider.connection.confirmTransaction(txId);
  let tx = await provider.connection.getTransaction(txId, { commitment: 'confirmed' });

  return parseAndPrintLogs(tx.meta.logMessages);
```


## Installation

`yarn install https://github.com/schwarzbi3r/sol_log_bench`
